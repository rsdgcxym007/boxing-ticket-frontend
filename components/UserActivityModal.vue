<template>
  <BaseModal
    :isOpen="isOpen"
    @close="$emit('close')"
    title="กิจกรรมผู้ใช้"
    size="xl"
  >
    <div class="space-y-6">
      <!-- User Selection -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseSelect
          v-model="selectedUserId"
          :options="userOptions"
          label="เลือกผู้ใช้"
          placeholder="ค้นหาชื่อหรืออีเมลผู้ใช้"
          searchable
          @change="loadUserActivity"
        />
        <BaseInput
          v-model="dateRange"
          label="ช่วงเวลา (วัน)"
          type="number"
          min="1"
          max="30"
          @change="loadUserActivity"
        />
      </div>

      <!-- Activity List -->
      <div v-if="loading" class="space-y-3">
        <div v-for="n in 5" :key="n" class="animate-pulse">
          <div class="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg">
            <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-300 rounded w-3/4"></div>
              <div class="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activities.length === 0" class="text-center py-12">
        <i class="mdi mdi-account-search text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">ไม่พบกิจกรรมของผู้ใช้ที่เลือก</p>
      </div>

      <div v-else class="space-y-3 max-h-96 overflow-y-auto">
        <div
          v-for="activity in activities"
          :key="`${activity.userId}-${activity.timestamp}`"
          class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="flex-shrink-0">
            <div
              :class="getActivityIconClass(activity.activity)"
              class="w-10 h-10 rounded-full flex items-center justify-center"
            >
              <i
                :class="getActivityIcon(activity.activity)"
                class="text-lg"
              ></i>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ getActivityLabel(activity.activity) }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatTime(activity.timestamp) }}
              </p>
            </div>
            <div class="flex items-center gap-4 mt-1">
              <p class="text-xs text-gray-500">
                <i class="mdi mdi-account text-blue-500 mr-1"></i>
                {{ activity.userName }}
              </p>
              <p class="text-xs text-gray-500">
                <i class="mdi mdi-ip-network text-purple-500 mr-1"></i>
                {{ activity.ipAddress }}
              </p>
            </div>
            <p
              class="text-xs text-gray-400 truncate"
              :title="activity.userAgent"
            >
              {{ formatUserAgent(activity.userAgent) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div
        v-if="activities.length > 0"
        class="grid grid-cols-3 gap-4 pt-4 border-t"
      >
        <div class="text-center">
          <div class="text-2xl font-bold text-indigo-600">
            {{ activities.length }}
          </div>
          <div class="text-xs text-gray-500">กิจกรรมทั้งหมด</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">
            {{ uniqueIPs.length }}
          </div>
          <div class="text-xs text-gray-500">IP Address</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600">
            {{ activityTypes.length }}
          </div>
          <div class="text-xs text-gray-500">ประเภทกิจกรรม</div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between">
        <BaseButton
          v-if="activities.length > 0"
          @click="exportUserActivity"
          variant="outline"
          color="indigo"
          class="flex items-center gap-2"
        >
          <i class="mdi mdi-download"></i>
          ส่งออก
        </BaseButton>
        <div class="flex gap-3 ml-auto">
          <BaseButton @click="$emit('close')" variant="outline" color="gray">
            ปิด
          </BaseButton>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useAudit, type UserActivity } from "../composables/useAudit";
import dayjs from "dayjs";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  close: [];
}>();

const { getUserActivity } = useAudit();

const loading = ref(false);
const activities = ref<UserActivity[]>([]);
const selectedUserId = ref("");
const dateRange = ref(7);

// Mock user options - in real app, this would come from API
const userOptions = [
  { value: "", label: "เลือกผู้ใช้", disabled: true },
  { value: "user1", label: "นาย สมชาย ใจดี (admin@example.com)" },
  { value: "user2", label: "นาง สมใส รักงาน (manager@example.com)" },
  { value: "user3", label: "นาย ทดสอบ ระบบ (staff@example.com)" },
];

const uniqueIPs = computed(() => {
  return [...new Set(activities.value.map((a) => a.ipAddress))];
});

const activityTypes = computed(() => {
  return [...new Set(activities.value.map((a) => a.activity))];
});

const loadUserActivity = async () => {
  if (!selectedUserId.value) return;

  loading.value = true;
  try {
    const startDate = dayjs()
      .subtract(dateRange.value, "day")
      .format("YYYY-MM-DD");
    const endDate = dayjs().format("YYYY-MM-DD");

    activities.value = await getUserActivity({
      userId: selectedUserId.value,
      startDate,
      endDate,
      limit: 100,
    });
  } catch (error) {
    console.error("Failed to load user activity:", error);
  } finally {
    loading.value = false;
  }
};

const getActivityLabel = (activity: string) => {
  const labels: Record<string, string> = {
    LOGIN: "เข้าสู่ระบบ",
    LOGOUT: "ออกจากระบบ",
    CREATE: "สร้างข้อมูล",
    UPDATE: "แก้ไขข้อมูล",
    DELETE: "ลบข้อมูล",
    VIEW: "ดูข้อมูล",
    DOWNLOAD: "ดาวน์โหลด",
    EXPORT: "ส่งออกข้อมูล",
  };
  return labels[activity] || activity;
};

const getActivityIcon = (activity: string) => {
  const icons: Record<string, string> = {
    LOGIN: "mdi mdi-login",
    LOGOUT: "mdi mdi-logout",
    CREATE: "mdi mdi-plus",
    UPDATE: "mdi mdi-pencil",
    DELETE: "mdi mdi-delete",
    VIEW: "mdi mdi-eye",
    DOWNLOAD: "mdi mdi-download",
    EXPORT: "mdi mdi-export",
  };
  return icons[activity] || "mdi mdi-circle";
};

const getActivityIconClass = (activity: string) => {
  const classes: Record<string, string> = {
    LOGIN: "bg-green-100 text-green-600",
    LOGOUT: "bg-orange-100 text-orange-600",
    CREATE: "bg-blue-100 text-blue-600",
    UPDATE: "bg-yellow-100 text-yellow-600",
    DELETE: "bg-red-100 text-red-600",
    VIEW: "bg-gray-100 text-gray-600",
    DOWNLOAD: "bg-indigo-100 text-indigo-600",
    EXPORT: "bg-purple-100 text-purple-600",
  };
  return classes[activity] || "bg-gray-100 text-gray-600";
};

const formatTime = (timestamp: string) => {
  return dayjs(timestamp).format("DD/MM/YYYY HH:mm:ss");
};

const formatUserAgent = (userAgent: string) => {
  if (!userAgent) return "ไม่ระบุ";

  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    return "Safari";
  if (userAgent.includes("Edge")) return "Edge";

  return userAgent.substring(0, 30) + "...";
};

const exportUserActivity = () => {
  const data = activities.value.map((activity) => ({
    timestamp: activity.timestamp,
    user: activity.userName,
    email: activity.userEmail,
    activity: getActivityLabel(activity.activity),
    ipAddress: activity.ipAddress,
    userAgent: activity.userAgent,
  }));

  const csvContent = [
    ["เวลา", "ผู้ใช้", "อีเมล", "กิจกรรม", "IP Address", "User Agent"],
    ...data.map((row) => [
      dayjs(row.timestamp).format("DD/MM/YYYY HH:mm:ss"),
      row.user,
      row.email,
      row.activity,
      row.ipAddress,
      row.userAgent,
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `user-activity-${selectedUserId.value}-${dayjs().format(
    "YYYY-MM-DD"
  )}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      // Reset form when modal opens
      selectedUserId.value = "";
      activities.value = [];
      dateRange.value = 7;
    }
  }
);
</script>

<style scoped>
/* Custom scrollbar for activity list */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
