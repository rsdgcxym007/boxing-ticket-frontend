import { defineStore } from "pinia";
import { Order } from "~/types/order";

interface ReferrerPreviewData {
  referrerId: string;
  referrerName: string;
  orders: Order[];
  filters: {
    startDate: string;
    endDate: string;
    status?: string;
    paymentMethod?: string;
  };
  timestamp: number;
}

export const useReferrerStore = defineStore("referrer", {
  state: () => ({
    previewData: null as ReferrerPreviewData | null,
  }),
  actions: {
    setPreviewData(data: ReferrerPreviewData) {
      this.previewData = { ...data, timestamp: Date.now() };
    },
    clearPreviewData() {
      this.previewData = null;
    },
    isDataValid(): boolean {
      if (!this.previewData) return false;
      const fiveMinutes = 5 * 60 * 1000;
      return Date.now() - this.previewData.timestamp < fiveMinutes;
    },
  },
});
