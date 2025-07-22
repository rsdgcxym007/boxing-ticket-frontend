import { ref, computed } from "vue";
import { useSingleToast } from "./useSingleToast";
import { useRuntimeConfig } from "nuxt/app";

export const useSeatManager = () => {
  const { showToast } = useSingleToast();
  const seatStates = ref(new Map<string, string>());
  const selectedSeats = ref<string[]>([]);
  const lockTimeout = ref<NodeJS.Timeout | null>(null);
  const config = useRuntimeConfig();
  const base = config.public.apiBase;
  const getToken = () => {
    if (process.client) {
      return localStorage.getItem("token") || "";
    }
    return "";
  };
  // สถานะที่นั่ง
  const SEAT_STATUS = {
    AVAILABLE: "AVAILABLE",
    LOCKED: "LOCKED",
    BOOKED: "BOOKED",
    SELECTED: "SELECTED",
  } as const;

  // สีของสถานะที่นั่ง
  const SEAT_COLORS = {
    AVAILABLE: "#4CAF50", // Green
    LOCKED: "#FF9800", // Orange
    BOOKED: "#F44336", // Red
    SELECTED: "#2196F3", // Blue
  } as const;

  // อัปเดตสถานะที่นั่ง
  const updateSeatStatus = (
    seatIds: string[],
    status: string,
    showAnimation = true
  ) => {
    seatIds.forEach((seatId) => {
      const seatElement = document.querySelector(
        `[data-seat-id="${seatId}"]`
      ) as HTMLElement;
      if (!seatElement) return;

      // อัปเดต visual state
      seatElement.className = `seat ${status.toLowerCase()}`;

      // อัปเดต interactivity
      switch (status) {
        case SEAT_STATUS.AVAILABLE:
          seatElement.style.backgroundColor = SEAT_COLORS.AVAILABLE;
          (seatElement as HTMLButtonElement).disabled = false;
          break;
        case SEAT_STATUS.LOCKED:
          seatElement.style.backgroundColor = SEAT_COLORS.LOCKED;
          (seatElement as HTMLButtonElement).disabled = true;
          break;
        case SEAT_STATUS.BOOKED:
          seatElement.style.backgroundColor = SEAT_COLORS.BOOKED;
          (seatElement as HTMLButtonElement).disabled = true;
          break;
        case SEAT_STATUS.SELECTED:
          seatElement.style.backgroundColor = SEAT_COLORS.SELECTED;
          (seatElement as HTMLButtonElement).disabled = false;
          break;
      }

      // แสดง animation
      if (showAnimation) {
        seatElement.classList.add("seat-update-animation");
        setTimeout(() => {
          seatElement.classList.remove("seat-update-animation");
        }, 500);
      }

      // อัปเดต internal state
      seatStates.value.set(seatId, status);
    });
  };

  // เลือกที่นั่ง
  const selectSeat = (seatId: string) => {
    if (selectedSeats.value.includes(seatId)) {
      // ยกเลิกการเลือก
      selectedSeats.value = selectedSeats.value.filter((id) => id !== seatId);
      updateSeatStatus([seatId], SEAT_STATUS.AVAILABLE);
    } else {
      // เลือกที่นั่ง
      selectedSeats.value.push(seatId);
      updateSeatStatus([seatId], SEAT_STATUS.SELECTED);
    }
  };

  // ล้างการเลือกที่นั่ง
  const clearSelection = () => {
    const previousSelected = [...selectedSeats.value];
    selectedSeats.value = [];
    updateSeatStatus(previousSelected, SEAT_STATUS.AVAILABLE);
  };

  // ตั้งค่า auto-unlock timer
  const setAutoUnlockTimer = (callback: () => void, minutes = 4) => {
    if (lockTimeout.value) {
      clearTimeout(lockTimeout.value);
    }

    lockTimeout.value = setTimeout(() => {
      callback();
      showToast("warning", "การเลือกที่นั่งหมดอายุ กรุณาเลือกใหม่");
    }, minutes * 60 * 1000);
  };

  // ยกเลิก auto-unlock timer
  const clearAutoUnlockTimer = () => {
    if (lockTimeout.value) {
      clearTimeout(lockTimeout.value);
      lockTimeout.value = null;
    }
  };

  // รีเฟรช seat availability จาก API
  const refreshSeatAvailability = async (showDate: string) => {
    try {
      const response = await fetch(
        `${base}/api/v1/seats?showDate=${showDate}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch seat availability");
      }

      const result = await response.json();

      // กรองเฉพาะที่นั่งที่มี seatNumber
      const validSeats = result.data.filter(
        (seat: any) => seat.seatNumber !== null
      );

      validSeats.forEach((seat: any) => {
        updateSeatStatus([seat.id], seat.status, false);
      });
    } catch (error) {
      console.error("Failed to refresh seat availability:", error);
      // toast.error("ไม่สามารถอัปเดตสถานะที่นั่งได้");
    }
  };

  // ฟังก์ชัน refresh ข้อมูลที่นั่งทั้งหมด
  const refreshSeatData = async (callback?: () => Promise<void>) => {
    try {
      if (callback) {
        await callback();
      }
    } catch (error) {
      console.error("❌ Failed to refresh seat data:", error);
      showToast("error", "ไม่สามารถอัปเดตข้อมูลที่นั่งได้");
    }
  };

  // ตรวจสอบสถานะที่นั่ง
  const getSeatStatus = (seatId: string): string => {
    return seatStates.value.get(seatId) || SEAT_STATUS.AVAILABLE;
  };

  // ตรวจสอบว่าที่นั่งถูกเลือกหรือไม่
  const isSeatSelected = (seatId: string): boolean => {
    return selectedSeats.value.includes(seatId);
  };

  // จำนวนที่นั่งที่เลือก
  const selectedSeatsCount = computed(() => selectedSeats.value.length);

  // ตรวจสอบว่าสามารถเลือกที่นั่งได้หรือไม่
  const canSelectSeat = (seatId: string): boolean => {
    const status = getSeatStatus(seatId);
    return status === SEAT_STATUS.AVAILABLE || status === SEAT_STATUS.SELECTED;
  };

  return {
    seatStates,
    selectedSeats,
    selectedSeatsCount,
    SEAT_STATUS,
    SEAT_COLORS,
    updateSeatStatus,
    selectSeat,
    clearSelection,
    setAutoUnlockTimer,
    clearAutoUnlockTimer,
    refreshSeatAvailability,
    refreshSeatData,
    getSeatStatus,
    isSeatSelected,
    canSelectSeat,
  };
};
