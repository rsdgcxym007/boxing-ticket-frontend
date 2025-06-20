<template>
  <div
    class="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4 py-10"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-[28px] w-full max-w-lg px-8 py-10 shadow-2xl relative border border-gray-100"
    >
      <!-- Close Button -->
      <button
        class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition"
        @click="$emit('close')"
      >
        <X class="w-5 h-5" />
      </button>

      <!-- Title -->
      <h2
        class="text-[26px] font-semibold text-center text-gray-900 mb-6 flex items-center justify-center gap-2 tracking-tight"
      >
        <FileText class="w-6 h-6 text-gray-800" />
        {{ t("summary.title") }}
      </h2>

      <!-- Order Info -->
      <div
        class="rounded-2xl bg-gray-50/70 border border-gray-200 p-5 shadow-sm mb-8 space-y-2"
      >
        <p class="text-sm text-gray-600">
          <span class="font-medium text-gray-700"
            >{{ t("summary.zone") }}:</span
          >
          {{ pageData.zoneKey.toUpperCase() }}
        </p>
        <p class="text-sm text-gray-600">
          <span class="font-medium text-gray-700"
            >{{ t("summary.seats") }}:</span
          >
          {{ pageData.selectedSeats.map((s) => s.seatNumber).join(", ") }}
        </p>
        <p class="text-sm">
          <span class="text-gray-700 font-medium"
            >{{ t("summary.total") }}:
          </span>
          <span class="text-blue-600 font-bold text-[16px]">
            {{ total.toLocaleString() }} {{ t("summary.baht") }}
          </span>
        </p>
        <div v-if="countdown > 0">
          <span
            class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 shadow-sm"
          >
            <AlarmClock class="w-4 h-4" /> {{ t("summary.timeLeft") }}:
            {{ Math.floor(countdown / 60) }}:{{
              (countdown % 60).toString().padStart(2, "0")
            }}
          </span>
        </div>
      </div>

      <!-- Payment Method -->
      <div class="mb-8">
        <p class="text-[15px] font-semibold text-gray-800 mb-3">
          {{ t("summary.selectMethod") }}
        </p>
        <div class="space-y-4">
          <!-- <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              v-model="pageData.method"
              value="qr"
              class="accent-blue-600 w-4 h-4"
            />
            <span class="flex items-center gap-2 text-gray-800">
              <QrCode class="w-5 h-5" />
              {{ t("summary.qr") }}
              <span class="text-xs text-blue-500 font-medium">(แนะนำ)</span>
            </span>
          </label>

          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              v-model="pageData.method"
              value="bank"
              class="accent-blue-600 w-4 h-4"
            />
            <span class="flex items-center gap-2 text-gray-800">
              <Banknote class="w-5 h-5" />
              {{ t("summary.bank") }}
            </span>
          </label> -->

          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              v-model="pageData.method"
              value="cash"
              class="accent-blue-600 w-4 h-4"
            />
            <span class="flex items-center gap-2 text-gray-800">
              <Wallet class="w-5 h-5" />
              {{ t("summary.cash") }}
            </span>
          </label>
        </div>
      </div>

      <!-- Conditional Section -->
      <div v-if="pageData.method === 'cash'" class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ t("summary.cashAmount") }}
        </label>
        <input
          type="number"
          v-model="pageData.total"
          class="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-inner"
          min="0"
        />
      </div>
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ "“Referrer Code (ถ้ามี)” หรือ “รหัสผู้แนะนำ (ถ้ามี)”" }}
        </label>
        <input
          type="text"
          v-model="pageData.referrerCode"
          class="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-inner"
          min="0"
          placeholder="Referrer Code ถ้ามี"
        />
      </div>
      <!-- 
      <div v-if="pageData.method === 'bank'" class="mb-6">
        <label class="text-sm font-medium text-gray-700">{{
          t("summary.uploadSlip")
        }}</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          @change="onFileChange"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <div v-if="slipPreview" class="mt-2 text-center">
          <img
            :src="slipPreview"
            class="max-w-full max-h-48 mx-auto border rounded shadow"
          />
        </div>
      </div>

      <div v-if="pageData.method === 'qr'" class="text-center mb-6 space-y-2">
        <img
          v-if="qrCode"
          :src="qrCode"
          class="w-44 h-44 mx-auto border rounded-xl shadow"
        />
        <p class="text-sm text-gray-500 italic">
          📷 {{ t("summary.scanPrompt") }}
        </p>
      </div> -->

      <!-- Buttons -->
      <div class="flex justify-between pt-4">
        <button
          @click="onCancel"
          class="px-5 py-2 text-sm text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100 transition"
        >
          ยกเลิก
        </button>
        <button
          @click="submitOrders"
          :disabled="!isValid"
          class="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold shadow-md hover:brightness-110 transition"
        >
          ✅ ยืนยันการชำระเงิน
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  QrCode,
  Banknote,
  Wallet,
  AlarmClock,
  FileText,
  X,
} from "lucide-vue-next";

import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useRuntimeConfig } from "nuxt/app";
import { usePageData } from "@/stores/pageData";
import { useOrder } from "@/composables/useOrder";
import { useScb } from "@/composables/useScb";
import { useWebSocket } from "@/composables/useSocket";
import { useToast } from "vue-toastification";

const toast = useToast();
const { t } = useI18n();
const router = useRouter();
const config = useRuntimeConfig();
const base = config.public.apiBase;

const { requestQR } = useScb();
const { submitOrder, cancelOrder, markAsPaidWithRef } = useOrder();
const { connectSocket, disconnectSocket } = useWebSocket("*");

const props = defineProps({
  zone: String,
  selectedSeats: Array,
  visible: Boolean,
  total: Number,
  userRole: { type: String, default: "GUEST" },
  dataZoneSelected: Object,
});

const emit = defineEmits(["close", "confirmed"]);
const pageData = usePageData();

const orderId = `ORDER${Date.now()}`.slice(0, 17);
const ref2 = "STADIUM";

const slipFile = ref(null);
const slipPreview = ref(null);
const submitted = ref(false);
const qrCode = ref("");

const countdown = ref(300);
let countdownTimer;

const setupCountdown = () => {
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
      emit("close");
      toast.warning(t("summary.timeout"));
    }
  }, 1000);
};

onMounted(async () => {
  setupCountdown();
  connectSocket();
  pageData.method = "cash";
  pageData.zoneKey = props.zone;
  pageData.selectedSeats = props.selectedSeats;
  pageData.total = props.total;
});

onBeforeUnmount(() => {
  clearInterval(countdownTimer);
  disconnectSocket();
});

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  slipFile.value = file;
  const reader = new FileReader();
  reader.onload = () => (slipPreview.value = reader.result);
  reader.readAsDataURL(file);
};

const isValid = computed(() =>
  pageData.method === "bank" ? !!slipFile.value : true
);

const onCancel = async () => {
  try {
    await cancelOrder(props.dataZoneSelected.orderId);
    toast.warning(t("summary.cancelled"));
  } catch (err) {
    console.error("Cancel Error", err);
    toast.error(t("summary.cancelError"));
  } finally {
    emit("close");
  }
};

const submitOrders = async () => {
  try {
    await markAsPaidWithRef(
      props.dataZoneSelected.orderId,
      pageData.referrerCode
    );
    submitted.value = true;
    pageData.resetPageData();
    router.push({
      path: "/confirmation",
      query: {
        zone: pageData.zoneKey,
        seats: pageData.selectedSeats.join(","),
        total: pageData.total,
      },
    });
  } catch (e) {
    toast.error(t("summary.submitError"));
    console.error("Submit Error:", e);
  }
};
</script>
