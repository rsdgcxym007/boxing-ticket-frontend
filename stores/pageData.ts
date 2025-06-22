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
    customerName: "",
    total: 0,
    page: 1,
    limit: 5,
    filters: { status: "", zone: "", search: "" },
    orders: [],
    hasNext: false,
    totalPage: 0,
    totalCount: 0,
    statusOptions: [
      { name: "ทั้งหมด", value: "" },
      { name: "ชำระแล้ว", value: "PAID" },
      { name: "จองแล้ว", value: "BOOKED" },
      { name: "ยกเลิก", value: "CANCELLED" },
    ],
    zoneOptions: [
      { label: "ทั้งหมด", value: "" },
      { label: "Back Left", value: "back-left" },
      { label: "Back Right", value: "back-right" },
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
      { label: "Front Ringside", value: "front-ringside" },
    ],
    totalSales: "0",
    monthSales: "0",
    totalOrders: 0,
    totalCustomers: 0,
    availableSeats: 0,
    dailySales: [],
    alerts: [],
    nextShowDate: "",
    nextShowAvailable: 0,
    nextShowBooked: 0,
    salesByZone: [],
    salesByMethod: [],
    topCustomers: [],
    topReferrers: [],
    orderStatusCounts: {},
  }),

  actions: {
    resetPageData() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      this.customerName = "";
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
