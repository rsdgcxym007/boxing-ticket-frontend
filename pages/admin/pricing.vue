<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0f1f3c] via-[#1a2b4d] to-[#0f1f3c] text-white px-4 py-6"
  >
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1
            class="text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            จัดการราคาตั๋ว
          </h1>
          <p class="text-gray-400 text-sm md:text-base">
            กำหนดราคาตั๋วสำหรับแต่ละประเภทที่นั่ง
          </p>
        </div>
        <button
          @click="showAddPriceModal = true"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <Icon icon="mdi:plus" class="text-lg" />
          เพิ่มราคาใหม่
        </button>
      </div>
    </div>

    <!-- Price Management Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div
        v-for="price in priceList"
        :key="price.id"
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-colors"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-semibold text-white mb-2">
              {{ price.seatType }}
            </h3>
            <p class="text-gray-300 text-sm">{{ price.description }}</p>
          </div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              price.status === 'active'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400',
            ]"
          >
            {{ price.status === "active" ? "เปิดใช้งาน" : "ปิดใช้งาน" }}
          </span>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-300">ราคาปกติ:</span>
            <span class="text-2xl font-bold text-white"
              >฿{{ price.regularPrice.toLocaleString() }}</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">ราคาพิเศษ:</span>
            <span class="text-lg font-semibold text-blue-400"
              >฿{{ price.specialPrice.toLocaleString() }}</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">จำนวนที่นั่ง:</span>
            <span class="text-white">{{ price.totalSeats }} ที่นั่ง</span>
          </div>
        </div>

        <div class="flex gap-2 mt-6">
          <button
            @click="editPrice(price)"
            class="flex-1 px-3 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors"
          >
            แก้ไข
          </button>
          <button
            @click="togglePriceStatus(price.id)"
            class="flex-1 px-3 py-2 bg-gray-600/20 text-gray-300 border border-gray-500/30 rounded-lg hover:bg-gray-600/30 transition-colors"
          >
            {{ price.status === "active" ? "ปิดใช้งาน" : "เปิดใช้งาน" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Price History Table -->
    <div
      class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
    >
      <h2 class="text-xl font-semibold text-white mb-6">
        ประวัติการเปลี่ยนแปลงราคา
      </h2>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/20">
              <th class="text-left py-3 px-4 text-gray-300 font-medium">
                วันที่
              </th>
              <th class="text-left py-3 px-4 text-gray-300 font-medium">
                ประเภทที่นั่ง
              </th>
              <th class="text-left py-3 px-4 text-gray-300 font-medium">
                ราคาเดิม
              </th>
              <th class="text-left py-3 px-4 text-gray-300 font-medium">
                ราคาใหม่
              </th>
              <th class="text-left py-3 px-4 text-gray-300 font-medium">
                ผู้แก้ไข
              </th>
              <th class="text-left py-3 px-4 text-gray-300 font-medium">
                หมายเหตุ
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="history in priceHistory"
              :key="history.id"
              class="border-b border-white/10 hover:bg-white/5"
            >
              <td class="py-3 px-4 text-white">
                {{ formatDate(history.date) }}
              </td>
              <td class="py-3 px-4 text-white">{{ history.seatType }}</td>
              <td class="py-3 px-4 text-red-400">
                ฿{{ history.oldPrice.toLocaleString() }}
              </td>
              <td class="py-3 px-4 text-green-400">
                ฿{{ history.newPrice.toLocaleString() }}
              </td>
              <td class="py-3 px-4 text-white">{{ history.changedBy }}</td>
              <td class="py-3 px-4 text-gray-300">{{ history.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Price Modal -->
    <div
      v-if="showAddPriceModal || showEditPriceModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold text-white mb-6">
          {{ showEditPriceModal ? "แก้ไขราคาตั๋ว" : "เพิ่มราคาตั๋วใหม่" }}
        </h3>

        <form @submit.prevent="savePrice" class="space-y-4">
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >ประเภทที่นั่ง</label
            >
            <input
              v-model="priceForm.seatType"
              type="text"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >คำอธิบาย</label
            >
            <textarea
              v-model="priceForm.description"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="2"
            ></textarea>
          </div>

          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >ราคาปกติ (บาท)</label
            >
            <input
              v-model.number="priceForm.regularPrice"
              type="number"
              min="0"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >ราคาพิเศษ (บาท)</label
            >
            <input
              v-model.number="priceForm.specialPrice"
              type="number"
              min="0"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >จำนวนที่นั่ง</label
            >
            <input
              v-model.number="priceForm.totalSeats"
              type="number"
              min="1"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {{ showEditPriceModal ? "บันทึกการแก้ไข" : "เพิ่มราคาใหม่" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

// Page meta
definePageMeta({
  middleware: ["auth", "admin-only"],
  layout: "admin",
});

// Reactive data
const showAddPriceModal = ref(false);
const showEditPriceModal = ref(false);

const priceForm = ref({
  id: null,
  seatType: "",
  description: "",
  regularPrice: 0,
  specialPrice: 0,
  totalSeats: 0,
});

// Mock data
const priceList = ref([
  {
    id: 1,
    seatType: "Ringside",
    description: "ที่นั่งติดริง มองเห็นการแข่งขันได้ชัดเจนที่สุด",
    regularPrice: 1800,
    specialPrice: 1500,
    totalSeats: 80,
    status: "active",
  },
  {
    id: 2,
    seatType: "Standard",
    description: "ที่นั่งมาตรฐาน มุมมองที่ดีและราคาย่อมเยา",
    regularPrice: 1500,
    specialPrice: 1200,
    totalSeats: 200,
    status: "active",
  },
  {
    id: 3,
    seatType: "VIP",
    description: "ที่นั่ง VIP พร้อมเครื่องดื่มฟรี",
    regularPrice: 2500,
    specialPrice: 2000,
    totalSeats: 40,
    status: "inactive",
  },
]);

const priceHistory = ref([
  {
    id: 1,
    date: "2024-01-15",
    seatType: "Ringside",
    oldPrice: 1600,
    newPrice: 1800,
    changedBy: "Admin",
    note: "ปรับราคาตามต้นทุนที่เพิ่มขึ้น",
  },
  {
    id: 2,
    date: "2024-01-10",
    seatType: "Standard",
    oldPrice: 1200,
    newPrice: 1500,
    changedBy: "Admin",
    note: "ปรับราคาให้สอดคล้องกับคุณภาพการบริการ",
  },
]);

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const editPrice = (price) => {
  priceForm.value = { ...price };
  showEditPriceModal.value = true;
};

const togglePriceStatus = (priceId) => {
  const price = priceList.value.find((p) => p.id === priceId);
  if (price) {
    price.status = price.status === "active" ? "inactive" : "active";
  }
};

const savePrice = () => {
  if (showEditPriceModal.value) {
    // Update existing price
    const index = priceList.value.findIndex((p) => p.id === priceForm.value.id);
    if (index !== -1) {
      priceList.value[index] = { ...priceForm.value };
    }
  } else {
    // Add new price
    const newPrice = {
      ...priceForm.value,
      id: Date.now(),
      status: "active",
    };
    priceList.value.push(newPrice);
  }

  closeModal();
};

const closeModal = () => {
  showAddPriceModal.value = false;
  showEditPriceModal.value = false;
  priceForm.value = {
    id: null,
    seatType: "",
    description: "",
    regularPrice: 0,
    specialPrice: 0,
    totalSeats: 0,
  };
};

// SEO
useSeoMeta({
  title: "Price Management - Admin Panel",
  description: "Manage ticket pricing for different seat types",
});
</script>
