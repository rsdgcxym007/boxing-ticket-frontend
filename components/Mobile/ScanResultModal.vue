<template>
  <div 
    class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <Icon icon="mdi:qrcode-scan" class="text-2xl" />
            <h3 class="text-lg font-semibold">ผลการสแกน</h3>
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
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
        <!-- Success Result -->
        <div v-if="result?.status === 'success'" class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="mdi:check-circle" class="text-3xl text-green-600" />
          </div>
          
          <h4 class="text-xl font-semibold text-gray-900 mb-2">สแกนสำเร็จ!</h4>
          
          <!-- Ticket Info -->
          <div v-if="result.ticket" class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">รหัสตั้ว:</span>
                <span class="font-medium">{{ result.ticket.ticketNumber }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">ประเภท:</span>
                <span class="font-medium">{{ getTicketTypeName(result.ticket.type) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">โซน:</span>
                <span class="font-medium">{{ result.ticket.zone || 'ไม่ระบุ' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">ราคา:</span>
                <span class="font-medium text-green-600">฿{{ formatPrice(result.ticket.price) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">สถานะ:</span>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {{ getStatusName(result.ticket.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Message -->
          <p v-if="result.message" class="text-gray-600 mb-6">{{ result.message }}</p>
          
          <!-- Action Buttons -->
          <div class="flex space-x-3">
            <button
              @click="$emit('scan-next')"
              class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              สแกนต่อ
            </button>
            <button
              @click="$emit('close')"
              class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>

        <!-- Error Result -->
        <div v-else-if="result?.status === 'error'" class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="mdi:alert-circle" class="text-3xl text-red-600" />
          </div>
          
          <h4 class="text-xl font-semibold text-gray-900 mb-2">เกิดข้อผิดพลาด</h4>
          
          <!-- Error Message -->
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p class="text-red-800">{{ result.message || 'ไม่สามารถสแกน QR Code ได้' }}</p>
          </div>

          <!-- QR Data (if available) -->
          <div v-if="result.data" class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h5 class="font-medium text-gray-900 mb-2">ข้อมูลที่สแกนได้:</h5>
            <p class="text-sm text-gray-600 break-all">{{ result.data }}</p>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex space-x-3">
            <button
              @click="$emit('scan-next')"
              class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              ลองใหม่
            </button>
            <button
              @click="$emit('close')"
              class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>

        <!-- Warning Result -->
        <div v-else-if="result?.status === 'warning'" class="text-center">
          <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="mdi:alert" class="text-3xl text-yellow-600" />
          </div>
          
          <h4 class="text-xl font-semibold text-gray-900 mb-2">คำเตือน</h4>
          
          <!-- Warning Message -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p class="text-yellow-800">{{ result.message }}</p>
          </div>

          <!-- Ticket Info (if available) -->
          <div v-if="result.ticket" class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">รหัสตั๋ว:</span>
                <span class="font-medium">{{ result.ticket.ticketNumber }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">สถานะ:</span>
                <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {{ getStatusName(result.ticket.status) }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex space-x-3">
            <button
              @click="$emit('scan-next')"
              class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              สแกนต่อ
            </button>
            <button
              @click="$emit('close')"
              class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else class="text-center py-8">
          <div class="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-gray-600">กำลังประมวลผล...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

// Props
const props = defineProps({
  result: {
    type: Object,
    default: () => ({})
  }
});

// Emits
defineEmits(['close', 'scan-next']);

// Helper functions
const getTicketTypeName = (type) => {
  const types = {
    'ringside': 'ริงไซด์',
    'vip': 'วีไอพี',
    'class_a': 'ชั้น A',
    'class_b': 'ชั้น B',
    'class_c': 'ชั้น C',
    'standing': 'ยืน'
  };
  return types[type] || type;
};

const getStatusName = (status) => {
  const statuses = {
    'available': 'ว่าง',
    'sold': 'ขายแล้ว',
    'used': 'ใช้แล้ว',
    'cancelled': 'ยกเลิก',
    'reserved': 'จอง'
  };
  return statuses[status] || status;
};

const formatPrice = (price) => {
  if (!price) return '0';
  return Number(price).toLocaleString();
};
</script>

<style scoped>
/* Custom animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Modal backdrop blur effect */
.bg-black\/80 {
  backdrop-filter: blur(4px);
}
</style>
