<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-4 overflow-auto"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl max-w-xl w-full p-6 shadow-lg space-y-6 relative text-gray-800"
    >
      <!-- Close -->
      <button
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        @click="$emit('close')"
      >
        ✕
      </button>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-gray-800">
        สรุปรายการสั่งซื้อ
      </h2>

      <!-- Order Info -->
      <div class="text-sm space-y-1">
        <p>
          <span class="font-semibold">โซน:</span>
          {{ pageData.zoneKey.toUpperCase() }}
        </p>
        <p>
          <span class="font-semibold">ที่นั่ง:</span>
          {{ pageData.selectedSeats.join(", ") }}
        </p>
        <p>
          <span class="font-semibold">ราคารวม:</span>
          <span class="text-blue-600 font-semibold"
            >{{ total.toLocaleString() }} บาท</span
          >
        </p>
        <p v-if="countdown > 0" class="text-red-600 font-semibold">
          เวลาที่เหลือ: {{ Math.floor(countdown / 60) }}:{{
            (countdown % 60).toString().padStart(2, "0")
          }}
        </p>
      </div>

      <!-- Payment Method -->
      <div class="space-y-3 pt-4">
        <p class="text-sm font-semibold">เลือกวิธีชำระเงิน:</p>
        <div class="space-y-2">
          <label class="flex items-center gap-3">
            <input type="radio" v-model="pageData.method" value="qr" />
            QR Code (แนะนำ)
          </label>
          <label class="flex items-center gap-3">
            <input type="radio" v-model="pageData.method" value="bank" />
            โอนเงิน (แนบสลิป)
          </label>
        </div>
      </div>

      <!-- QR Section -->
      <div v-if="pageData.method === 'qr'" class="text-center">
        <img
          v-if="qrCode"
          :src="qrCode"
          alt="QR Code"
          class="w-40 h-40 mx-auto border rounded"
        />
        <p class="text-sm text-gray-500 mt-2">โปรดแสกนเพื่อชำระเงิน</p>
      </div>

      <!-- Slip Upload -->
      <div v-if="pageData.method === 'bank'" class="space-y-2">
        <label class="block text-sm font-medium">แนบสลิป:</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          @change="onFileChange"
          class="w-full border rounded px-3 py-2 text-sm"
        />
        <div v-if="slipPreview" class="mt-2 text-center">
          <img
            :src="slipPreview"
            class="max-w-full max-h-48 mx-auto border rounded shadow"
          />
        </div>
      </div>

      <!-- Success -->
      <div v-if="submitted" class="text-center py-8">
        <p class="text-lg font-semibold text-green-600">
          ระบบได้รับคำสั่งซื้อแล้ว
        </p>
        <p class="text-sm text-gray-500">
          กรุณารอเจ้าหน้าที่ตรวจสอบการชำระเงิน
        </p>
      </div>
      <button @click="mockPaymentSuccess">จำลองการชำระเงิน</button>
      <!-- Buttons -->
      <div v-if="!submitted" class="flex justify-center gap-4 pt-4">
        <button
          class="px-5 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 text-sm font-medium"
          @click="onCancel"
        >
          ยกเลิก
        </button>
        <button
          class="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm font-semibold"
          @click="submitOrders"
          :disabled="!isValid"
        >
          ยืนยันการชำระเงิน
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";
import { usePageData } from "@/composables/usePageData";
import { useOrder } from "@/composables/useOrder";
import { useScb } from "@/composables/useScb";
import { useToast } from "@/composables/useToast";
import QRCode from "qrcode";
import { useWebSocket } from "@/composables/useSocket";
import { useRuntimeConfig } from "nuxt/app";
const config = useRuntimeConfig();
const base = config.public.apiBase;
const { showToast } = useToast();
const { requestQR } = useScb();
const { submitOrder, cancelOrder } = useOrder();

const props = defineProps({
  zone: String,
  selectedSeats: Array,
  visible: Boolean,
  total: Number,
  userRole: { type: String, default: "GUEST" },
  dataZoneSelected: Object,
});

const emit = defineEmits(["close", "confirmed"]);
const router = useRouter();
const pageData = usePageData();
const orderId = `ORDER${Date.now()}`.slice(0, 17);
const ref2 = "STADIUM";
const slipFile = ref(null);
const slipPreview = ref(null);
const submitted = ref(false);
const qrCode = ref("");

const countdown = ref(300);
let countdownTimer;

const { connectSocket, disconnectSocket } = useWebSocket("*");
onMounted(async () => {
  connectSocket();
  pageData.method = "qr";
  pageData.zoneKey = props.zone;
  pageData.selectedSeats = props.selectedSeats;

  if (pageData.method === "qr") {
    const result = await requestQR(props.total, orderId, ref2);
    QRCode.toDataURL(result.qrRawData).then((url) => {
      qrCode.value = url;
    });

    countdownTimer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(countdownTimer);
        emit("close");
        showToast("หมดเวลาชำระเงิน กรุณาเลือกใหม่อีกครั้ง", "warning");
      }
    }, 1000);
  }
});

onMounted(() => {
  connectSocket();
});

onBeforeUnmount(() => {
  clearInterval(countdownTimer);
  disconnectSocket();
});

// File Upload
function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  slipFile.value = file;
  const reader = new FileReader();
  reader.onload = () => (slipPreview.value = reader.result);
  reader.readAsDataURL(file);
}

const isValid = computed(() => {
  return pageData.method === "bank" ? !!slipFile.value : true;
});

const onCancel = async () => {
  try {
    await cancelOrder(props.dataZoneSelected.orderId);
    showToast("❌ ยกเลิกออเดอร์เรียบร้อยแล้ว", "warning");
  } catch (err) {
    console.error("Cancel Error", err);
    showToast("ไม่สามารถยกเลิกออเดอร์ได้", "error");
  } finally {
    emit("close");
  }
};

// Submit Order
async function submitOrders() {
  try {
    await submitOrder({
      orderId: props.dataZoneSelected.orderId,
      zone: pageData.zoneKey,
      selectedSeats: pageData.selectedSeats,
      total: props.total,
      method: pageData.method,
    });
    submitted.value = true;
    emit("confirmed");
    router.push("/confirmation");
  } catch (e) {
    showToast("เกิดข้อผิดพลาดในการสั่งซื้อ", "error");
    console.error("❌ submit error:", e);
  }
}

// MOCK Webhook Flow
const mockPaymentSuccess = async () => {
  if (!pageData.selectedSeats.length || !pageData.zoneKey || !props.total) {
    showToast("ข้อมูลไม่ครบ ไม่สามารถ mock ได้");
    return;
  }
  try {
    const res = await submitOrder({
      orderId: props.dataZoneSelected.orderId,
      zone: pageData.zoneKey,
      selectedSeats: pageData.selectedSeats,
      total: props.total,
      method: pageData.method,
    });

    await $fetch(`${base}/api/scb/payment-webhook`, {
      method: "POST",
      body: {
        ref1: res.orderId,
        ref2,
        amount: props.total.toString(),
        status: "SUCCESS",
        transactionId: `MOCKTXN${Math.floor(Math.random() * 1000000)}`,
        signature:
          "1f0ebe8a333f07a6277ab7c743dc085cbf5c0dc4a6b6c54dce2baa6d28eb765d",
      },
    });

    showToast("🎉 Mock Payment สำเร็จ!");
    router.push("/confirmation");
  } catch (err) {
    showToast("❌ Mock payment ล้มเหลว");
    console.error("mockPayment error:", err);
  }
};
</script>

<style scoped>
input[type="radio"]:disabled {
  cursor: not-allowed;
}
</style>
