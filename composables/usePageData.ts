// composables/usePageData.ts
import { reactive, computed } from "vue";
import { useRoute } from "vue-router";

export const usePageData = () => {
  const route = useRoute();

  const pageData = reactive({
    orderId: "",
    showSeatModal: false,
    showPaymentModal: false,
    zoneKey: "",
    currentZoneSeats: [],
    selectedSeats: [],
    bookedSeats: [],
    method: "", // ✅ เพิ่มบรรทัดนี้
    userRole: "GUEST",
  });

  return pageData;
};
