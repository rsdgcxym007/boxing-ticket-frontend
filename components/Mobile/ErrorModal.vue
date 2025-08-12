<template>
  <div
    class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl max-w-md w-full overflow-hidden">
      <!-- Header -->
      <div
        class="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 text-white"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <Icon icon="mdi:alert-circle" class="text-2xl" />
            <h3 class="text-lg font-semibold">เกิดข้อผิดพลาด</h3>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <Icon icon="mdi:close" class="text-xl" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Error Icon -->
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Icon icon="mdi:alert-circle" class="text-3xl text-red-600" />
          </div>
          <h4 class="text-xl font-semibold text-gray-900 mb-2">
            เกิดข้อผิดพลาด
          </h4>
        </div>

        <!-- Error Message -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-red-800 text-center">
            {{ error || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ" }}
          </p>
        </div>

        <!-- Error Details (if provided) -->
        <div v-if="errorDetails" class="bg-gray-50 rounded-lg p-4 mb-6">
          <h5 class="font-medium text-gray-900 mb-2">รายละเอียด:</h5>
          <pre class="text-sm text-gray-600 whitespace-pre-wrap">{{
            errorDetails
          }}</pre>
        </div>

        <!-- Common Error Solutions -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h5 class="font-medium text-blue-900 mb-2">วิธีแก้ไขที่แนะนำ:</h5>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• ตรวจสอบ QR Code ให้ชัดเจน</li>
            <li>• ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</li>
            <li>• ลองสแกนใหม่อีกครั้ง</li>
            <li>• รีสตาร์ทแอปพลิเคชัน</li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3">
          <button
            @click="$emit('retry')"
            class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Icon icon="mdi:refresh" class="text-lg" />
            <span>ลองใหม่</span>
          </button>
          <button
            @click="$emit('close')"
            class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            ปิด
          </button>
        </div>

        <!-- Support Contact -->
        <div class="mt-6 pt-4 border-t border-gray-200 text-center">
          <p class="text-sm text-gray-500 mb-2">
            หากปัญหายังคงเกิดขึ้น กรุณาติดต่อเจ้าหน้าที่
          </p>
          <button
            @click="contactSupport"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            ติดต่อฝ่ายสนับสนุน
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

// Props
const props = defineProps({
  error: {
    type: String,
    default: "",
  },
  errorDetails: {
    type: String,
    default: "",
  },
});

// Emits
defineEmits(["close", "retry"]);

// Methods
const contactSupport = () => {
  // Open support contact (could be phone, email, or chat)
  window.open("tel:+66123456789", "_self");
};
</script>

<style scoped>
/* Error animation */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* Custom scrollbar for error details */
pre::-webkit-scrollbar {
  width: 4px;
}

pre::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

pre::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}
</style>
