<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-12 px-4">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <!-- Profile Header -->
        <div
          class="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-gray-200"
        >
          <div class="relative">
            <img
              :src="userProfile.avatar || '/images/default-avatar.jpg'"
              alt="Profile Picture"
              class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-500"
            />
            <button
              @click="showAvatarModal = true"
              class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors"
            >
              <Icon icon="mdi:camera" class="text-lg" />
            </button>
          </div>
          <div class="text-center md:text-left flex-1">
            <h1 class="text-3xl font-bold text-gray-900">
              {{ userProfile.name }}
            </h1>
            <p class="text-gray-600 mt-1">{{ userProfile.email }}</p>
            <div
              class="flex flex-wrap gap-2 mt-3 justify-center md:justify-start"
            >
              <span
                class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                VIP Member
              </span>
              <span
                class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                Active Since {{ new Date(userProfile.joinDate).getFullYear() }}
              </span>
            </div>
          </div>
        </div>

        <!-- Profile Navigation -->
        <div class="mt-8">
          <nav class="flex space-x-8 border-b border-gray-200">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'pb-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              <Icon :icon="tab.icon" class="inline mr-2" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="mt-8">
          <!-- Personal Information Tab -->
          <div v-if="activeTab === 'personal'" class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-900">ข้อมูลส่วนตัว</h2>

            <form @submit.prevent="updateProfile" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >ชื่อ</label
                  >
                  <input
                    v-model="editProfile.firstName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >นามสกุล</label
                  >
                  <input
                    v-model="editProfile.lastName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >อีเมล</label
                  >
                  <input
                    v-model="editProfile.email"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >โทรศัพท์</label
                  >
                  <input
                    v-model="editProfile.phone"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >ที่อยู่</label
                  >
                  <textarea
                    v-model="editProfile.address"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >วันเกิด</label
                  >
                  <input
                    v-model="editProfile.birthDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >เพศ</label
                  >
                  <select
                    v-model="editProfile.gender"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">เลือกเพศ</option>
                    <option value="male">ชาย</option>
                    <option value="female">หญิง</option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>

          <!-- Ticket History Tab -->
          <div v-if="activeTab === 'tickets'" class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-900">
              ประวัติการซื้อตั๋ว
            </h2>

            <div class="space-y-4">
              <div
                v-for="ticket in ticketHistory"
                :key="ticket.id"
                class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div
                  class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div class="flex-1">
                    <h3 class="font-semibold text-lg text-gray-900">
                      {{ ticket.eventName }}
                    </h3>
                    <p class="text-gray-600 mt-1">
                      {{ formatDate(ticket.eventDate) }}
                    </p>
                    <div class="flex flex-wrap gap-2 mt-2">
                      <span
                        class="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm"
                      >
                        {{ ticket.seatType }}
                      </span>
                      <span
                        class="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm"
                      >
                        {{ ticket.seatNumber }}
                      </span>
                      <span
                        :class="[
                          'px-2 py-1 rounded text-sm',
                          ticket.status === 'used'
                            ? 'bg-green-100 text-green-800'
                            : ticket.status === 'active'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800',
                        ]"
                      >
                        {{ getStatusText(ticket.status) }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-semibold text-gray-900">
                      ฿{{ ticket.price }}
                    </p>
                    <p class="text-sm text-gray-600">
                      {{ formatDate(ticket.purchaseDate) }}
                    </p>
                    <button
                      v-if="ticket.status === 'active'"
                      @click="viewTicket(ticket.id)"
                      class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      ดูตั๋ว
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Preferences Tab -->
          <div v-if="activeTab === 'preferences'" class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-900">การตั้งค่า</h2>

            <form @submit.prevent="updatePreferences" class="space-y-6">
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                  การแจ้งเตือน
                </h3>
                <div class="space-y-4">
                  <label class="flex items-center">
                    <input
                      v-model="preferences.emailNotifications"
                      type="checkbox"
                      class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="text-gray-700">แจ้งเตือนผ่านอีเมล</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="preferences.smsNotifications"
                      type="checkbox"
                      class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="text-gray-700">แจ้งเตือนผ่าน SMS</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="preferences.eventReminders"
                      type="checkbox"
                      class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="text-gray-700">แจ้งเตือนก่อนการแข่งขัน</span>
                  </label>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                  ความปลอดภัย
                </h3>
                <div class="space-y-4">
                  <button
                    type="button"
                    @click="showChangePassword = true"
                    class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                  >
                    เปลี่ยนรหัสผ่าน
                  </button>
                  <button
                    type="button"
                    @click="enable2FA"
                    class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors ml-4"
                  >
                    เปิดใช้ 2FA
                  </button>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  บันทึกการตั้งค่า
                </button>
              </div>
            </form>
          </div>

          <!-- Statistics Tab -->
          <div v-if="activeTab === 'stats'" class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-900">สถิติการใช้งาน</h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                class="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center"
              >
                <Icon
                  icon="mdi:ticket"
                  class="text-3xl text-blue-600 mx-auto mb-2"
                />
                <h3 class="text-2xl font-bold text-blue-900">
                  {{ stats.totalTickets }}
                </h3>
                <p class="text-blue-700">ตั๋วที่ซื้อทั้งหมด</p>
              </div>
              <div
                class="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
              >
                <Icon
                  icon="mdi:calendar-check"
                  class="text-3xl text-green-600 mx-auto mb-2"
                />
                <h3 class="text-2xl font-bold text-green-900">
                  {{ stats.eventsAttended }}
                </h3>
                <p class="text-green-700">เหตุการณ์ที่เข้าร่วม</p>
              </div>
              <div
                class="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center"
              >
                <Icon
                  icon="mdi:cash"
                  class="text-3xl text-purple-600 mx-auto mb-2"
                />
                <h3 class="text-2xl font-bold text-purple-900">
                  ฿{{ stats.totalSpent.toLocaleString() }}
                </h3>
                <p class="text-purple-700">ยอดใช้จ่ายทั้งหมด</p>
              </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                ประเภทที่นั่งที่ชื่นชอบ
              </h3>
              <div class="space-y-3">
                <div
                  v-for="(seat, index) in stats.favoriteSeatTypes"
                  :key="index"
                  class="flex justify-between items-center"
                >
                  <span class="text-gray-700">{{ seat.type }}</span>
                  <div class="flex items-center gap-2">
                    <div class="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-blue-600 h-2 rounded-full"
                        :style="{ width: `${seat.percentage}%` }"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-600"
                      >{{ seat.count }} ครั้ง</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div
      v-if="showChangePassword"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          เปลี่ยนรหัสผ่าน
        </h3>
        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >รหัสผ่านปัจจุบัน</label
            >
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >รหัสผ่านใหม่</label
            >
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >ยืนยันรหัสผ่านใหม่</label
            >
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="flex justify-end gap-4 mt-6">
            <button
              type="button"
              @click="showChangePassword = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              เปลี่ยนรหัสผ่าน
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

// Authentication check
definePageMeta({
  middleware: "auth",
});

// Reactive data
const activeTab = ref("personal");
const showChangePassword = ref(false);
const showAvatarModal = ref(false);

const tabs = [
  { id: "personal", name: "ข้อมูลส่วนตัว", icon: "mdi:account" },
  { id: "tickets", name: "ประวัติตั๋ว", icon: "mdi:ticket" },
  { id: "preferences", name: "การตั้งค่า", icon: "mdi:cog" },
  { id: "stats", name: "สถิติ", icon: "mdi:chart-line" },
];

// User profile data (mock data - replace with real API calls)
const userProfile = ref({
  name: "สมชาย จันทร์เพ็ญ",
  email: "somchai@example.com",
  avatar: "/images/user-avatar.jpg",
  joinDate: "2023-01-15",
});

const editProfile = ref({
  firstName: "สมชาย",
  lastName: "จันทร์เพ็ญ",
  email: "somchai@example.com",
  phone: "081-234-5678",
  address: "123 หมู่ 1 ตำบลปาตอง อำเภอกะทู้ จังหวัดภูเก็ต 83150",
  birthDate: "1990-05-15",
  gender: "male",
});

const preferences = ref({
  emailNotifications: true,
  smsNotifications: false,
  eventReminders: true,
});

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const ticketHistory = ref([
  {
    id: 1,
    eventName: "Muay Thai Championship Night",
    eventDate: "2024-01-15",
    purchaseDate: "2024-01-01",
    seatType: "Ringside",
    seatNumber: "R-15",
    price: 1800,
    status: "used",
  },
  {
    id: 2,
    eventName: "International Boxing Match",
    eventDate: "2024-02-20",
    purchaseDate: "2024-02-05",
    seatType: "Standard",
    seatNumber: "S-42",
    price: 1500,
    status: "active",
  },
  {
    id: 3,
    eventName: "Friday Fight Night",
    eventDate: "2024-01-30",
    purchaseDate: "2024-01-20",
    seatType: "Ringside",
    seatNumber: "R-8",
    price: 1800,
    status: "used",
  },
]);

const stats = ref({
  totalTickets: 12,
  eventsAttended: 8,
  totalSpent: 18600,
  favoriteSeatTypes: [
    { type: "Ringside", count: 7, percentage: 58 },
    { type: "Standard", count: 5, percentage: 42 },
  ],
});

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusText = (status) => {
  switch (status) {
    case "used":
      return "ใช้แล้ว";
    case "active":
      return "ใช้งานได้";
    case "expired":
      return "หมดอายุ";
    case "cancelled":
      return "ยกเลิก";
    default:
      return status;
  }
};

const updateProfile = async () => {
  try {
    // Call API to update profile
    console.log("Updating profile:", editProfile.value);
    // Show success message
    alert("บันทึกข้อมูลเรียบร้อยแล้ว");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  }
};

const updatePreferences = async () => {
  try {
    // Call API to update preferences
    console.log("Updating preferences:", preferences.value);
    alert("บันทึกการตั้งค่าเรียบร้อยแล้ว");
  } catch (error) {
    console.error("Error updating preferences:", error);
    alert("เกิดข้อผิดพลาดในการบันทึกการตั้งค่า");
  }
};

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert("รหัสผ่านใหม่ไม่ตรงกัน");
    return;
  }

  try {
    // Call API to change password
    console.log("Changing password");
    showChangePassword.value = false;
    passwordForm.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    alert("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
  } catch (error) {
    console.error("Error changing password:", error);
    alert("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
  }
};

const enable2FA = () => {
  alert("ฟีเจอร์ 2FA จะเปิดใช้งานในเร็วๆ นี้");
};

const viewTicket = (ticketId) => {
  navigateTo(`/tickets/${ticketId}`);
};

// SEO
useSeoMeta({
  title: "My Profile - Patong Boxing Stadium",
  description:
    "Manage your profile, view ticket history and update preferences at Patong Boxing Stadium",
  ogTitle: "My Profile - Patong Boxing Stadium",
  ogDescription: "Manage your account and view your boxing ticket history",
});
</script>
