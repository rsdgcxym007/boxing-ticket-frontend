<template>
  <div
    class="min-h-screen flex items-center justify-center bg-[#0a1323] text-white px-4"
  >
    <div
      class="w-full max-w-xl p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl space-y-8"
    >
      <h2
        class="text-3xl font-semibold text-center flex items-center justify-center gap-2 text-white"
      >
        <i class="mdi mdi-ticket-confirm-outline text-blue-400 text-4xl" />
        ออกตั๋วยืน
      </h2>

      <!-- ชื่อผู้ซื้อ -->
      <div>
        <label class="text-sm mb-1 flex items-center gap-2 text-blue-300">
          <i class="mdi mdi-account-outline text-lg" />
          ชื่อผู้ซื้อ
        </label>
        <input
          v-model="pageData.customerName"
          type="text"
          placeholder="เช่น สมชาย ใจดี"
          class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition hover:border-blue-300 hover:ring-1"
        />
      </div>

      <!-- จำนวนตั๋ว -->
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="text-sm mb-1 flex items-center gap-2 text-purple-300">
            <i class="mdi mdi-human-male text-purple-400" />
            ผู้ใหญ่ <span class="text-xs text-gray-400">(1500)</span>
          </label>
          <input
            v-model.number="pageData.standingAdultQty"
            type="number"
            min="0"
            class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition hover:border-purple-300 hover:ring-1"
          />
        </div>
        <div class="flex-1">
          <label class="text-sm mb-1 flex items-center gap-2 text-pink-300">
            <i class="mdi mdi-human-child text-pink-400" />
            เด็ก <span class="text-xs text-gray-400">(1300)</span>
          </label>
          <input
            v-model.number="pageData.standingChildQty"
            type="number"
            min="0"
            class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition hover:border-pink-300 hover:ring-1"
          />
        </div>
      </div>

      <!-- Referrer -->
      <div>
        <label class="text-sm mb-1 flex items-center gap-2 text-yellow-300">
          <i class="mdi mdi-account-star-outline text-yellow-400" />
          Referrer Code (ถ้ามี)
        </label>
        <input
          v-model="pageData.referrerCode"
          type="text"
          placeholder="เช่น FRESHYTOUR"
          class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition hover:border-yellow-300 hover:ring-1"
        />
      </div>

      <!-- วันที่ -->
      <div>
        <label class="text-sm mb-1 flex items-center gap-2 text-indigo-300">
          <i class="mdi mdi-calendar-month-outline text-indigo-400" />
          วันที่แสดง
        </label>
        <DatePicker
          v-model="pageData.showDate"
          placeholder="เลือกวันที่"
          :dark="true"
        />
      </div>

      <!-- ปุ่ม -->
      <div class="flex justify-end gap-3 pt-2">
        <button
          @click="handleCreateOrder"
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-lg transition"
        >
          <i class="mdi mdi-plus-circle-outline text-xl" />
          สร้างออเดอร์
        </button>

        <button
          @click="handlePayNow"
          :disabled="!orderId"
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg transition disabled:opacity-50"
        >
          <i class="mdi mdi-cash-multiple text-xl" />
          ชำระเงิน
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "vue-toastification";
import { usePayments } from "../composables/usePayments";
import { useOrder } from "../composables/useOrder";
import { useAuthStore } from "../stores/auth";
import { usePageData } from "../stores/pageData";
const auth = useAuthStore();
const isLoading = usePageData();
const { createStanding } = useOrder();
const { createPayStanding } = usePayments();
const toast = useToast();
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const pageData = ref({
  customerName: "",
  standingAdultQty: 0,
  standingChildQty: 0,
  referrerCode: "",
  showDate: `${yyyy}-${mm}-${dd}`,
});
const orderId = ref<string | null>(null);

const handleCreateOrder = async () => {
  const { standingAdultQty, standingChildQty, showDate } = pageData.value;
  if (!showDate || standingAdultQty + standingChildQty === 0) {
    toast.error("กรุณากรอกข้อมูลให้ครบ");
    return;
  }
  isLoading.loading = true;

  try {
    const res = await createStanding({
      userId: auth.user?.id ?? "",
      standingAdultQty,
      standingChildQty,
      showDate,
      method: "CASH",
      status: "BOOKED",
      referrerCode: pageData.value.referrerCode ?? "",
      customerName: pageData.value.customerName,
    });

    orderId.value = res.id;
    isLoading.loading = false;
  } catch (err) {
    isLoading.loading = false;
  } finally {
    isLoading.loading = false;
  }
};

const handlePayNow = async () => {
  isLoading.loading = true;
  const { standingAdultQty, standingChildQty, customerName, referrerCode } =
    pageData.value;
  if (!orderId.value) return;

  const total = standingAdultQty * 1500 + standingChildQty * 1300;

  try {
    await createPayStanding({
      userId: auth.user?.id ?? "",
      orderId: orderId.value,
      amount: total,
      method: "CASH",
      referrerCode: referrerCode || undefined,
      customerName,
    });
    orderId.value = null;
    Object.assign(pageData.value, {
      customerName: "",
      standingAdultQty: 0,
      standingChildQty: 0,
      referrerCode: "",
      showDate: "",
    });
    isLoading.loading = false;
  } catch (err) {
    isLoading.loading = false;
  } finally {
    isLoading.loading = false;
  }
};
</script>
