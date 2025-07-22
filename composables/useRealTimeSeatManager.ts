// composables/useRealTimeSeatManager.ts
import { ref, computed, reactive, watch } from "vue";
import { useAuthStore } from "../stores/auth";
import dayjs from "dayjs";

export interface Seat {
  id: string;
  seatNumber: string;
  status: string;
  bookingStatus?: string;
  isLockedUntil?: string;
  lockedByUser?: string;
  price?: number;
  [key: string]: any;
}

export interface SeatSelection {
  seatId: string;
  userId: string;
  timestamp: string;
  isTemporary?: boolean;
}

export interface WebSocketSeatEvent {
  action:
    | "seat_selected"
    | "seat_deselected"
    | "seat_locked"
    | "seat_unlocked"
    | "seats_cancelled";
  userId: string;
  seatIds: string[];
  zoneKey: string;
  showDate: string;
  timestamp: string;
}

export const useRealTimeSeatManager = () => {
  const authStore = useAuthStore();

  // ===== Core State =====
  const allSeats = ref<Map<string, Seat>>(new Map());
  const mySelectedSeats = ref<Set<string>>(new Set());
  const otherUsersSelections = ref<Map<string, SeatSelection>>(new Map());
  const bookedSeats = ref<Set<string>>(new Set());
  const isLoading = ref(false);
  const lastUpdateTimestamp = ref<string>("");

  // ===== Helper Functions =====
  const getCurrentUserId = (): string => {
    return authStore.user?.id || "anonymous";
  };

  const getDateKey = (date: Date | string): string => {
    return dayjs(date).format("YYYY-MM-DD");
  };

  // ===== Computed Properties =====
  const mySelectedSeatsArray = computed(() => {
    const result: Seat[] = [];
    mySelectedSeats.value.forEach((seatId) => {
      const seat = allSeats.value.get(seatId);
      if (seat) {
        result.push(seat);
      }
    });
    return result;
  });

  const selectedSeatCount = computed(() => mySelectedSeats.value.size);

  const totalPrice = computed(() => {
    let total = 0;
    mySelectedSeats.value.forEach((seatId) => {
      const seat = allSeats.value.get(seatId);
      if (seat && seat.price) {
        total += seat.price;
      }
    });
    return total || selectedSeatCount.value * 1800; // fallback price
  });

  // ===== Seat Status Management =====
  const getSeatStatus = (
    seat: Seat
  ): "available" | "selected" | "locked" | "BOOKED" => {
    if (!seat) return "available";

    const seatId = seat.id;

    // Check if I selected this seat
    if (mySelectedSeats.value.has(seatId)) {
      return "selected";
    }

    // Check if another user selected this seat
    if (otherUsersSelections.value.has(seatId)) {
      return "locked";
    }

    // Check if permanently booked
    if (bookedSeats.value.has(seatId)) {
      console.log("seatId", seatId);

      return "BOOKED";
    }

    // Check booking status from server
    const bookingStatus = seat.bookingStatus as string;
    if (["RESERVED"].includes(bookingStatus)) {
      return "locked"; // Treat RESERVED as locked
    }
    if (["BOOKED", "PAID", "PENDING"].includes(bookingStatus)) {
      return "BOOKED";
    }

    // ✅ Check if seat is locked by isLockedUntil and bookingStatus = "SELECTED"
    if (seat.isLockedUntil && bookingStatus === "SELECTED") {
      const today = new Date();
      const lockDate = new Date(seat.isLockedUntil);

      // เช็คว่าเป็นวันเดียวกันหรือไม่
      const isSameDay = today.toDateString() === lockDate.toDateString();
      const isStillLocked = lockDate > today; // ยังไม่หมดเวลาล็อค

      console.log(`🔒 Checking seat ${seat.seatNumber} lock:`, {
        isLockedUntil: seat.isLockedUntil,
        bookingStatus,
        isSameDay,
        isStillLocked,
        today: today.toISOString(),
        lockDate: lockDate.toISOString(),
      });

      if (isSameDay && isStillLocked) {
        return "locked";
      }
    }

    return "available";
  };

  const canSelectSeat = (seatId: string): boolean => {
    const seat = allSeats.value.get(seatId);
    if (!seat) return false;

    const status = getSeatStatus(seat);
    return status === "available";
  };

  // ===== Seat Management Functions =====
  const initializeSeats = (seats: Seat[]) => {
    console.log("🔄 กำลังเริ่มต้นข้อมูลที่นั่ง:", seats.length);
    console.log("seats", seats);

    // Clear existing data
    allSeats.value.clear();
    bookedSeats.value.clear();

    // Process seats
    seats.forEach((seat) => {
      allSeats.value.set(seat.id, { ...seat });

      // ✅ ถ้าเป็นที่นั่งที่เราเลือกอยู่ ไม่ต้องเปลี่ยน bookingStatus
      const isMySelection = mySelectedSeats.value.has(seat.id);

      // If seat is not truly booked and isLockedUntil is null, reset bookingStatus
      if (!isMySelection) {
        const currentDateKey = getDateKey(new Date());
        const seatLockDate = seat.isLockedUntil
          ? getDateKey(new Date(seat.isLockedUntil))
          : null;

        // If locked for today, mark as RESERVED
        if (seat.isLockedUntil && seatLockDate === currentDateKey) {
          seat.bookingStatus = "RESERVED";
        }

        // If not locked and not truly booked, reset bookingStatus
        if (!seat.isLockedUntil && seat.bookingStatus === "SELECTED") {
          seat.bookingStatus = "AVAILABLE";
        }
      }

      const bookingStatus = seat.bookingStatus as string;
      console.log(
        "bookingStatus",
        bookingStatus,
        "isMySelection:",
        isMySelection
      );

      if (["BOOKED", "PAID", "PENDING", "RESERVED"].includes(bookingStatus)) {
        bookedSeats.value.add(seat.id);
      }
    });

    console.log("✅ เริ่มต้นข้อมูลที่นั่งสำเร็จ:", {
      total: allSeats.value.size,
      booked: bookedSeats.value.size,
      mySelected: mySelectedSeats.value.size,
      othersSelected: otherUsersSelections.value.size,
    });
  };

  const selectSeat = (seatId: string): boolean => {
    if (!canSelectSeat(seatId)) {
      return false;
    }

    mySelectedSeats.value.add(seatId);
    console.log("✅ เลือกที่นั่ง:", seatId);
    return true;
  };

  const deselectSeat = (seatId: string): boolean => {
    const wasSelected = mySelectedSeats.value.has(seatId);
    mySelectedSeats.value.delete(seatId);

    if (wasSelected) {
      console.log("❌ ยกเลิกการเลือกที่นั่ง:", seatId);
    }

    return wasSelected;
  };

  const clearMySelections = () => {
    const count = mySelectedSeats.value.size;
    mySelectedSeats.value.clear();
    console.log("🧹 ล้างการเลือกที่นั่งทั้งหมด:", count);
  };

  // ===== WebSocket Event Handling (Source of Truth) =====
  const handleWebSocketEvent = (event: WebSocketSeatEvent) => {
    const currentUserId = getCurrentUserId();
    if (event.userId === currentUserId) return;
    // Update state only, do not fetch API
    switch (event.action) {
      case "seat_selected":
        event.seatIds.forEach((seatId) => {
          if (!mySelectedSeats.value.has(seatId)) {
            otherUsersSelections.value.set(seatId, {
              seatId,
              userId: event.userId,
              timestamp: event.timestamp,
              isTemporary: true,
            });
            // Mark seat as locked in allSeats
            const seat = allSeats.value.get(seatId);
            if (seat) {
              allSeats.value.set(seatId, {
                ...seat,
                isLockedUntil: event.timestamp,
                bookingStatus: "SELECTED",
              });
            }
          }
        });
        break;
      case "seat_deselected":
      case "seat_unlocked":
        event.seatIds.forEach((seatId) => {
          const selection = otherUsersSelections.value.get(seatId);
          if (selection && selection.userId === event.userId) {
            otherUsersSelections.value.delete(seatId);
            // Unlock seat in allSeats
            const seat = allSeats.value.get(seatId);
            if (seat) {
              allSeats.value.set(seatId, {
                ...seat,
                isLockedUntil: undefined,
                bookingStatus: "AVAILABLE",
              });
            }
          }
        });
        break;
      case "seats_cancelled":
        // Remove all selections from this user
        otherUsersSelections.value.forEach((selection, seatId) => {
          if (selection.userId === event.userId) {
            otherUsersSelections.value.delete(seatId);
            const seat = allSeats.value.get(seatId);
            if (seat) {
              allSeats.value.set(seatId, {
                ...seat,
                isLockedUntil: undefined,
                bookingStatus: "AVAILABLE",
              });
            }
          }
        });
        break;
      case "seat_locked":
        event.seatIds.forEach((seatId) => {
          if (!mySelectedSeats.value.has(seatId)) {
            otherUsersSelections.value.set(seatId, {
              seatId,
              userId: event.userId,
              timestamp: event.timestamp,
              isTemporary: false,
            });
            const seat = allSeats.value.get(seatId);
            if (seat) {
              allSeats.value.set(seatId, {
                ...seat,
                isLockedUntil: event.timestamp,
                bookingStatus: "RESERVED",
              });
            }
          }
        });
        break;
    }
    // Update timestamp for UI reactivity
    lastUpdateTimestamp.value = new Date().toISOString();
  };

  const handleOtherUserSeatSelection = (event: WebSocketSeatEvent) => {
    console.log("🔒 คนอื่นเลือกที่นั่ง:", event.seatIds);

    event.seatIds.forEach((seatId) => {
      // Don't override my selections
      if (mySelectedSeats.value.has(seatId)) {
        console.log("⚠️ ข้าม seat ที่ฉันเลือกไว้แล้ว:", seatId);
        return;
      }

      // Mark as selected by other user
      otherUsersSelections.value.set(seatId, {
        seatId,
        userId: event.userId,
        timestamp: event.timestamp,
        isTemporary: true,
      });

      console.log("✅ ล็อคที่นั่ง:", seatId, "โดย user:", event.userId);
    });

    console.log("📊 สถิติที่นั่ง:", {
      mySelected: mySelectedSeats.value.size,
      othersSelected: otherUsersSelections.value.size,
      total: allSeats.value.size,
    });
  };

  const handleOtherUserSeatDeselection = (event: WebSocketSeatEvent) => {
    event.seatIds.forEach((seatId) => {
      const selection = otherUsersSelections.value.get(seatId);
      if (selection && selection.userId === event.userId) {
        otherUsersSelections.value.delete(seatId);
      }
    });

    // toast.info(`มีผู้ใช้อื่นยกเลิกที่นั่ง ${event.seatIds.length} ที่นั่ง`, {
    //   timeout: 2000,
    // });
  };

  const handleOtherUserCancellation = (event: WebSocketSeatEvent) => {
    // Remove all selections from this user
    const toRemove: string[] = [];
    otherUsersSelections.value.forEach((selection, seatId) => {
      if (selection.userId === event.userId) {
        toRemove.push(seatId);
      }
    });

    toRemove.forEach((seatId) => {
      otherUsersSelections.value.delete(seatId);
    });

    if (toRemove.length > 0) {
      //   toast.info(`มีผู้ใช้อื่นยกเลิกที่นั่งทั้งหมด`, { timeout: 2000 });
    }
  };

  const handleSeatLocked = (event: WebSocketSeatEvent) => {
    event.seatIds.forEach((seatId) => {
      if (!mySelectedSeats.value.has(seatId)) {
        otherUsersSelections.value.set(seatId, {
          seatId,
          userId: event.userId,
          timestamp: event.timestamp,
          isTemporary: false,
        });
      }
    });
  };

  const handleSeatUnlocked = (event: WebSocketSeatEvent) => {
    event.seatIds.forEach((seatId) => {
      const selection = otherUsersSelections.value.get(seatId);
      if (selection && selection.userId === event.userId) {
        otherUsersSelections.value.delete(seatId);
      }
    });
  };

  // ===== Refresh Management =====
  const refreshSeatsWithoutLosingSelection = async (
    fetchFunction: Function,
    zoneKey: string,
    showDate: string | Date
  ) => {
    console.log("🔄 กำลังรีเฟรชข้อมูลที่นั่งโดยไม่ให้เสียการเลือก...");

    try {
      isLoading.value = true;

      // Backup current selections
      const mySelectionBackup = new Set(mySelectedSeats.value);
      const othersSelectionBackup = new Map(otherUsersSelections.value);

      // Fetch fresh data
      const freshSeats = await fetchFunction(zoneKey, showDate);

      // Reinitialize seats
      console.log("freshSeats", freshSeats);

      initializeSeats(freshSeats);

      // Restore my selections (only if seats still exist and are available)
      mySelectedSeats.value.clear();
      mySelectionBackup.forEach((seatId) => {
        if (allSeats.value.has(seatId) && canSelectSeat(seatId)) {
          mySelectedSeats.value.add(seatId);
        }
      });

      // Restore other users' selections (only if seats still exist)
      otherUsersSelections.value.clear();
      othersSelectionBackup.forEach((selection, seatId) => {
        if (allSeats.value.has(seatId)) {
          otherUsersSelections.value.set(seatId, selection);
        }
      });

      console.log("✅ รีเฟรชสำเร็จ - รักษาการเลือกไว้:", {
        myRestored: mySelectedSeats.value.size,
        othersRestored: otherUsersSelections.value.size,
      });

      return true;
    } catch (error) {
      console.error("❌ รีเฟรชล้มเหลว:", error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // ===== Utility Functions =====
  const getStats = () => {
    return {
      totalSeats: allSeats.value.size,
      mySelected: mySelectedSeats.value.size,
      othersSelected: otherUsersSelections.value.size,
      booked: bookedSeats.value.size,
      available:
        allSeats.value.size -
        mySelectedSeats.value.size -
        otherUsersSelections.value.size -
        bookedSeats.value.size,
    };
  };

  const getSeatsSummary = () => {
    const seats = mySelectedSeatsArray.value;
    return {
      seats,
      seatNumbers: seats.map((s) => s.seatNumber).join(", "),
      totalPrice: totalPrice.value,
      count: seats.length,
    };
  };

  // ===== Cleanup =====
  const cleanup = () => {
    allSeats.value.clear();
    mySelectedSeats.value.clear();
    otherUsersSelections.value.clear();
    bookedSeats.value.clear();
    console.log("🧹 ล้างข้อมูลทั้งหมด");
  };

  // ===== Return API =====
  return {
    // State
    allSeats: computed(() => {
      // Force reactivity by including lastUpdateTimestamp
      lastUpdateTimestamp.value; // Access to trigger reactivity
      return Array.from(allSeats.value.values());
    }),
    mySelectedSeats: mySelectedSeatsArray,
    selectedSeatCount,
    totalPrice,
    isLoading,
    lastUpdateTimestamp,

    // Functions
    initializeSeats,
    selectSeat,
    deselectSeat,
    clearMySelections,
    getSeatStatus,
    canSelectSeat,
    handleWebSocketEvent,
    refreshSeatsWithoutLosingSelection,
    getStats,
    getSeatsSummary,
    cleanup,
  };
};
