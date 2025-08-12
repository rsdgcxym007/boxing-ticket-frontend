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
            จัดการโซนนั่ง
          </h1>
          <p class="text-gray-400 text-sm md:text-base">
            กำหนดและจัดการโซนที่นั่งในสนามมวย
          </p>
        </div>
        <button
          @click="showAddZoneModal = true"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <Icon icon="mdi:plus" class="text-lg" />
          เพิ่มโซนใหม่
        </button>
      </div>
    </div>

    <!-- Stadium Layout Preview -->
    <div
      class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-8"
    >
      <h2 class="text-xl font-semibold text-white mb-4">แผนผังสนามมวย</h2>

      <!-- Ring in center -->
      <div class="relative max-w-4xl mx-auto">
        <!-- Boxing Ring -->
        <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-600/30 border-2 border-red-500 rounded-lg flex items-center justify-center"
        >
          <span class="text-white font-bold">RING</span>
        </div>

        <!-- Zones around the ring -->
        <div class="grid grid-cols-4 gap-4 p-20">
          <!-- Ringside zones -->
          <div
            v-for="zone in zones.filter((z) => z.type === 'ringside')"
            :key="zone.id"
            :class="[
              'p-4 rounded-lg border-2 cursor-pointer transition-colors',
              zone.status === 'active'
                ? 'bg-green-600/20 border-green-500'
                : 'bg-red-600/20 border-red-500',
            ]"
            @click="selectZone(zone)"
          >
            <div class="text-center">
              <div class="text-sm font-semibold">{{ zone.name }}</div>
              <div class="text-xs text-gray-300">
                {{ zone.seatCount }} ที่นั่ง
              </div>
            </div>
          </div>
        </div>

        <!-- Standard zones (outer ring) -->
        <div class="absolute inset-0 grid grid-cols-6 gap-2 p-4">
          <div
            v-for="zone in zones.filter((z) => z.type === 'standard')"
            :key="zone.id"
            :class="[
              'p-2 rounded border cursor-pointer transition-colors text-xs',
              zone.status === 'active'
                ? 'bg-blue-600/20 border-blue-500'
                : 'bg-gray-600/20 border-gray-500',
            ]"
            @click="selectZone(zone)"
          >
            <div class="text-center">
              <div class="font-semibold">{{ zone.name }}</div>
              <div class="text-xs text-gray-300">{{ zone.seatCount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Zone Management Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div
        v-for="zone in zones"
        :key="zone.id"
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-colors"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-semibold text-white mb-2">
              {{ zone.name }}
            </h3>
            <p class="text-gray-300 text-sm">{{ zone.description }}</p>
          </div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              zone.status === 'active'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400',
            ]"
          >
            {{ zone.status === "active" ? "เปิดใช้งาน" : "ปิดใช้งาน" }}
          </span>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-300">ประเภท:</span>
            <span class="text-white capitalize">{{ zone.type }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">จำนวนที่นั่ง:</span>
            <span class="text-white">{{ zone.seatCount }} ที่นั่ง</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">ที่นั่งว่าง:</span>
            <span class="text-green-400"
              >{{ zone.availableSeats }} ที่นั่ง</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">อัตราการใช้งาน:</span>
            <span class="text-blue-400"
              >{{
                Math.round(
                  ((zone.seatCount - zone.availableSeats) / zone.seatCount) *
                    100
                )
              }}%</span
            >
          </div>
        </div>

        <div class="flex gap-2 mt-6">
          <button
            @click="editZone(zone)"
            class="flex-1 px-3 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors"
          >
            แก้ไข
          </button>
          <button
            @click="toggleZoneStatus(zone.id)"
            class="flex-1 px-3 py-2 bg-gray-600/20 text-gray-300 border border-gray-500/30 rounded-lg hover:bg-gray-600/30 transition-colors"
          >
            {{ zone.status === "active" ? "ปิดใช้งาน" : "เปิดใช้งาน" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Zone Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-300 text-sm">โซนทั้งหมด</p>
            <p class="text-2xl font-bold text-white">{{ zones.length }}</p>
          </div>
          <Icon icon="mdi:stadium" class="text-3xl text-blue-400" />
        </div>
      </div>

      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-300 text-sm">ที่นั่งทั้งหมด</p>
            <p class="text-2xl font-bold text-white">{{ totalSeats }}</p>
          </div>
          <Icon icon="mdi:seat" class="text-3xl text-green-400" />
        </div>
      </div>

      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-300 text-sm">ที่นั่งว่าง</p>
            <p class="text-2xl font-bold text-white">
              {{ totalAvailableSeats }}
            </p>
          </div>
          <Icon icon="mdi:seat-outline" class="text-3xl text-purple-400" />
        </div>
      </div>

      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-300 text-sm">อัตราการใช้งาน</p>
            <p class="text-2xl font-bold text-white">
              {{ overallOccupancyRate }}%
            </p>
          </div>
          <Icon icon="mdi:chart-pie" class="text-3xl text-orange-400" />
        </div>
      </div>
    </div>

    <!-- Add/Edit Zone Modal -->
    <div
      v-if="showAddZoneModal || showEditZoneModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold text-white mb-6">
          {{ showEditZoneModal ? "แก้ไขโซนที่นั่ง" : "เพิ่มโซนใหม่" }}
        </h3>

        <form @submit.prevent="saveZone" class="space-y-4">
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >ชื่อโซน</label
            >
            <input
              v-model="zoneForm.name"
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
              v-model="zoneForm.description"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="2"
            ></textarea>
          </div>

          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >ประเภทโซน</label
            >
            <select
              v-model="zoneForm.type"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="ringside">Ringside</option>
              <option value="standard">Standard</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >จำนวนที่นั่ง</label
            >
            <input
              v-model.number="zoneForm.seatCount"
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
              {{ showEditZoneModal ? "บันทึกการแก้ไข" : "เพิ่มโซนใหม่" }}
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
const showAddZoneModal = ref(false);
const showEditZoneModal = ref(false);

const zoneForm = ref({
  id: null,
  name: "",
  description: "",
  type: "standard",
  seatCount: 0,
});

// Mock data
const zones = ref([
  {
    id: 1,
    name: "Ringside A",
    description: "ที่นั่งติดริงด้านหน้า",
    type: "ringside",
    seatCount: 20,
    availableSeats: 5,
    status: "active",
  },
  {
    id: 2,
    name: "Ringside B",
    description: "ที่นั่งติดริงด้านข้าง",
    type: "ringside",
    seatCount: 20,
    availableSeats: 8,
    status: "active",
  },
  {
    id: 3,
    name: "Standard North",
    description: "ที่นั่งมาตรฐานด้านเหนือ",
    type: "standard",
    seatCount: 50,
    availableSeats: 25,
    status: "active",
  },
  {
    id: 4,
    name: "Standard South",
    description: "ที่นั่งมาตรฐานด้านใต้",
    type: "standard",
    seatCount: 50,
    availableSeats: 30,
    status: "active",
  },
  {
    id: 5,
    name: "Standard East",
    description: "ที่นั่งมาตรฐานด้านตะวันออก",
    type: "standard",
    seatCount: 50,
    availableSeats: 20,
    status: "active",
  },
  {
    id: 6,
    name: "Standard West",
    description: "ที่นั่งมาตรฐานด้านตะวันตก",
    type: "standard",
    seatCount: 50,
    availableSeats: 35,
    status: "inactive",
  },
]);

// Computed properties
const totalSeats = computed(() => {
  return zones.value.reduce((total, zone) => total + zone.seatCount, 0);
});

const totalAvailableSeats = computed(() => {
  return zones.value.reduce((total, zone) => total + zone.availableSeats, 0);
});

const overallOccupancyRate = computed(() => {
  if (totalSeats.value === 0) return 0;
  return Math.round(
    ((totalSeats.value - totalAvailableSeats.value) / totalSeats.value) * 100
  );
});

// Methods
const selectZone = (zone) => {
  console.log("Selected zone:", zone);
  // Could open zone details or highlight it
};

const editZone = (zone) => {
  zoneForm.value = { ...zone };
  showEditZoneModal.value = true;
};

const toggleZoneStatus = (zoneId) => {
  const zone = zones.value.find((z) => z.id === zoneId);
  if (zone) {
    zone.status = zone.status === "active" ? "inactive" : "active";
  }
};

const saveZone = () => {
  if (showEditZoneModal.value) {
    // Update existing zone
    const index = zones.value.findIndex((z) => z.id === zoneForm.value.id);
    if (index !== -1) {
      zones.value[index] = {
        ...zoneForm.value,
        availableSeats: zones.value[index].availableSeats, // Keep existing available seats
      };
    }
  } else {
    // Add new zone
    const newZone = {
      ...zoneForm.value,
      id: Date.now(),
      availableSeats: zoneForm.value.seatCount, // All seats available initially
      status: "active",
    };
    zones.value.push(newZone);
  }

  closeModal();
};

const closeModal = () => {
  showAddZoneModal.value = false;
  showEditZoneModal.value = false;
  zoneForm.value = {
    id: null,
    name: "",
    description: "",
    type: "standard",
    seatCount: 0,
  };
};

// SEO
useSeoMeta({
  title: "Zone Management - Admin Panel",
  description: "Manage seating zones and stadium layout",
});
</script>
