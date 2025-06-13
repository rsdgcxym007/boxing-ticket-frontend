// composables/usePageData.ts
import { reactive, computed } from "vue";
import { useRoute } from "vue-router";

export const usePageData = () => {
  const route = useRoute();

  const pageData = reactive({
    showSeatModal: false,
    showPaymentModal: false,
    zoneKey: "",
    currentZoneSeats: [],
    selectedSeats: [],
    bookedSeats: [],
  });

  return pageData;
};
