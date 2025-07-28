// stores/pageData.ts
import { defineStore } from "pinia";
import dayjs from "dayjs";
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
    customerPhone: "",
    customerEmail: "",
    total: 0,
    page: 1,
    limit: 10,
    selectedSeatsMap: {},
    filters: {
      status: "",
      zone: "",
      search: "",
      showDate: dayjs(new Date()).format("YYYY-MM-DD"),
      createdBy: "",
    },
    orders: [],
    hasNext: false,
    totalPage: 0,
    totalCount: 0,
    statusOptions: [
      { name: "ทั้งหมด", value: "" },
      { name: "ชำระแล้ว", value: "PAID" },
      { name: "จองแล้ว", value: "BOOKED" },
      { name: "รอดำเนินการ", value: "PENDING" },
      { name: "ยกเลิก", value: "CANCELLED" },
    ],
    zoneOptions: [
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
    CheckLimitChatSeat: 0,
  }),

  actions: {
    resetPageData() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      this.customerName = "";
      this.customerPhone = "";
      this.customerEmail = "";
      this.loading = false;
      this.showSummaryModal = false;
      this.zoneKey = "";
      this.selectedZone = "";
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
      this.CheckLimitChatSeat = 0;
    },
  },
});
