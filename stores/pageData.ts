// stores/pageData.ts
import { defineStore } from "pinia";

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");

export const usePageData = defineStore("pageData", {
  state: () => ({
    loading: false,
    showSummaryModal: false,
    zoneKey: "",
    showDate: `${yyyy}-${mm}-${dd}`,
    showSeatModal: false,
    showPaymentModal: false,
    currentZoneSeats: [],
    selectedSeats: [],
    bookedSeats: [],
    totalAmount: 0,
    orderId: "",
    userRole: "",
    method: "",
    referrerCode: "",
    total: 0,
  }),

  actions: {
    resetPageData() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");

      this.loading = false;
      this.showSummaryModal = false;
      this.zoneKey = "";
      this.showDate = `${yyyy}-${mm}-${dd}`;
      this.showSeatModal = false;
      this.showPaymentModal = false;
      this.currentZoneSeats = [];
      this.selectedSeats = [];
      this.bookedSeats = [];
      this.totalAmount = 0;
      this.orderId = "";
      this.userRole = "";
      this.method = "";
      this.referrerCode = "";
      this.total = 0;
    },
  },
});
