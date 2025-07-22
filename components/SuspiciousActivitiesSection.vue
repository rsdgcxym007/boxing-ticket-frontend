<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-red-900 flex items-center gap-2">
        <i class="mdi mdi-shield-alert text-red-500"></i>
        กิจกรรมน่าสงสัย
      </h3>
      <div class="flex gap-2">
        <BaseButton
          @click="$emit('refresh')"
          variant="outline"
          color="red"
          size="sm"
          class="flex items-center gap-2"
        >
          <i class="mdi mdi-refresh"></i>
          รีเฟรช
        </BaseButton>
        <BaseButton
          @click="$emit('close')"
          variant="ghost"
          color="gray"
          size="sm"
        >
          <i class="mdi mdi-close"></i>
        </BaseButton>
      </div>
    </div>

    <!-- Risk Level Filter -->
    <div class="flex items-center gap-4">
      <label class="text-sm font-medium text-gray-700"
        >กรองตามระดับเสี่ยง:</label
      >
      <div class="flex gap-2">
        <button
          v-for="level in riskLevels"
          :key="level.value"
          @click="
            selectedRiskLevel =
              selectedRiskLevel === level.value ? '' : level.value
          "
          :class="[
            'px-3 py-1 text-xs font-medium rounded-full transition-colors',
            selectedRiskLevel === level.value
              ? level.activeClass
              : level.inactiveClass,
          ]"
        >
          {{ level.label }}
        </button>
      </div>
    </div>

    <!-- Activities List -->
    <div v-if="filteredActivities.length === 0" class="text-center py-8">
      <i class="mdi mdi-shield-check text-6xl text-green-300 mb-4"></i>
      <p class="text-green-600 font-medium">ไม่พบกิจกรรมน่าสงสัย</p>
      <p class="text-sm text-gray-500 mt-1">ระบบปลอดภัย</p>
    </div>

    <div v-else class="space-y-4 max-h-96 overflow-y-auto">
      <div
        v-for="activity in filteredActivities"
        :key="activity.id"
        class="border rounded-lg p-4 hover:shadow-md transition-shadow"
        :class="getRiskBorderClass(activity.riskLevel)"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div
              :class="getRiskIconClass(activity.riskLevel)"
              class="p-2 rounded-lg"
            >
              <i :class="getRiskIcon(activity.riskLevel)" class="text-lg"></i>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900">
                {{ activity.activity }}
              </h4>
              <p class="text-sm text-gray-500">
                {{ formatDateTime(activity.timestamp) }}
              </p>
            </div>
          </div>
          <span
            :class="getRiskBadgeClass(activity.riskLevel)"
            class="px-2 py-1 text-xs font-medium rounded-full"
          >
            {{ getRiskLabel(activity.riskLevel) }}
          </span>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">IP Address:</span>
              <span class="font-mono text-gray-900">{{
                activity.details.ipAddress
              }}</span>
            </div>
            <div v-if="activity.details.userId" class="flex justify-between">
              <span class="text-gray-600">User ID:</span>
              <span class="font-mono text-gray-900">{{
                activity.details.userId
              }}</span>
            </div>
            <div
              v-if="activity.details.attemptCount"
              class="flex justify-between"
            >
              <span class="text-gray-600">จำนวนครั้ง:</span>
              <span class="font-semibold text-red-600">{{
                activity.details.attemptCount
              }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">User Agent:</span>
              <span
                class="text-gray-900 text-right max-w-48 truncate"
                :title="activity.details.userAgent"
              >
                {{ formatUserAgent(activity.details.userAgent) }}
              </span>
            </div>
            <div v-if="activity.details.pattern" class="flex justify-between">
              <span class="text-gray-600">Pattern:</span>
              <span class="text-gray-900">{{ activity.details.pattern }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="flex items-center justify-between mt-4 pt-3 border-t border-gray-100"
        >
          <div class="flex gap-2">
            <BaseButton
              @click="investigateActivity(activity)"
              size="sm"
              variant="outline"
              color="blue"
              class="flex items-center gap-1"
            >
              <i class="mdi mdi-magnify text-xs"></i>
              สอบสวน
            </BaseButton>
            <BaseButton
              @click="blockIP(activity.details.ipAddress)"
              size="sm"
              variant="outline"
              color="red"
              class="flex items-center gap-1"
            >
              <i class="mdi mdi-block-helper text-xs"></i>
              บล็อค IP
            </BaseButton>
          </div>
          <BaseButton
            @click="markAsResolved(activity)"
            size="sm"
            variant="ghost"
            color="green"
            class="flex items-center gap-1"
          >
            <i class="mdi mdi-check text-xs"></i>
            แก้ไขแล้ว
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div
      v-if="activities.length > 0"
      class="grid grid-cols-4 gap-4 pt-4 border-t"
    >
      <div class="text-center">
        <div class="text-2xl font-bold text-red-600">{{ criticalCount }}</div>
        <div class="text-xs text-gray-500">วิกฤต</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-orange-600">{{ highCount }}</div>
        <div class="text-xs text-gray-500">สูง</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-yellow-600">{{ mediumCount }}</div>
        <div class="text-xs text-gray-500">ปานกลาง</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">{{ lowCount }}</div>
        <div class="text-xs text-gray-500">ต่ำ</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useSingleToast } from "../composables/useSingleToast";
import type { SuspiciousActivity } from "../composables/useAudit";
import dayjs from "dayjs";

const props = defineProps({
  activities: {
    type: Array as () => SuspiciousActivity[],
    default: () => [],
  },
});

const emit = defineEmits<{
  close: [];
  refresh: [];
}>();

const { showToast } = useSingleToast();
const selectedRiskLevel = ref("");

const riskLevels = [
  {
    value: "",
    label: "ทั้งหมด",
    activeClass: "bg-gray-200 text-gray-800",
    inactiveClass: "bg-gray-100 text-gray-600 hover:bg-gray-200",
  },
  {
    value: "critical",
    label: "วิกฤต",
    activeClass: "bg-red-200 text-red-800",
    inactiveClass: "bg-red-100 text-red-600 hover:bg-red-200",
  },
  {
    value: "high",
    label: "สูง",
    activeClass: "bg-orange-200 text-orange-800",
    inactiveClass: "bg-orange-100 text-orange-600 hover:bg-orange-200",
  },
  {
    value: "medium",
    label: "ปานกลาง",
    activeClass: "bg-yellow-200 text-yellow-800",
    inactiveClass: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
  },
  {
    value: "low",
    label: "ต่ำ",
    activeClass: "bg-blue-200 text-blue-800",
    inactiveClass: "bg-blue-100 text-blue-600 hover:bg-blue-200",
  },
];

const filteredActivities = computed(() => {
  if (!selectedRiskLevel.value) return props.activities;
  return props.activities.filter(
    (activity) => activity.riskLevel === selectedRiskLevel.value
  );
});

const criticalCount = computed(
  () => props.activities.filter((a) => a.riskLevel === "critical").length
);
const highCount = computed(
  () => props.activities.filter((a) => a.riskLevel === "high").length
);
const mediumCount = computed(
  () => props.activities.filter((a) => a.riskLevel === "medium").length
);
const lowCount = computed(
  () => props.activities.filter((a) => a.riskLevel === "low").length
);

const getRiskLabel = (riskLevel: string) => {
  const labels: Record<string, string> = {
    critical: "วิกฤต",
    high: "สูง",
    medium: "ปานกลาง",
    low: "ต่ำ",
  };
  return labels[riskLevel] || riskLevel;
};

const getRiskIcon = (riskLevel: string) => {
  const icons: Record<string, string> = {
    critical: "mdi mdi-alert-octagon",
    high: "mdi mdi-alert",
    medium: "mdi mdi-alert-circle",
    low: "mdi mdi-information",
  };
  return icons[riskLevel] || "mdi mdi-help-circle";
};

const getRiskIconClass = (riskLevel: string) => {
  const classes: Record<string, string> = {
    critical: "bg-red-100 text-red-600",
    high: "bg-orange-100 text-orange-600",
    medium: "bg-yellow-100 text-yellow-600",
    low: "bg-blue-100 text-blue-600",
  };
  return classes[riskLevel] || "bg-gray-100 text-gray-600";
};

const getRiskBadgeClass = (riskLevel: string) => {
  const classes: Record<string, string> = {
    critical: "bg-red-100 text-red-800",
    high: "bg-orange-100 text-orange-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-blue-100 text-blue-800",
  };
  return classes[riskLevel] || "bg-gray-100 text-gray-800";
};

const getRiskBorderClass = (riskLevel: string) => {
  const classes: Record<string, string> = {
    critical: "border-red-200 bg-red-50",
    high: "border-orange-200 bg-orange-50",
    medium: "border-yellow-200 bg-yellow-50",
    low: "border-blue-200 bg-blue-50",
  };
  return classes[riskLevel] || "border-gray-200 bg-gray-50";
};

const formatDateTime = (timestamp: string) => {
  return dayjs(timestamp).format("DD/MM/YYYY HH:mm:ss");
};

const formatUserAgent = (userAgent: string) => {
  if (!userAgent) return "ไม่ระบุ";

  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    return "Safari";
  if (userAgent.includes("Edge")) return "Edge";

  return userAgent.substring(0, 20) + "...";
};

const investigateActivity = (activity: SuspiciousActivity) => {
  showToast("info", `เริ่มการสอบสวนกิจกรรม: ${activity.activity}`);
  // Implement investigation logic
};

const blockIP = (ipAddress: string) => {
  showToast("warning", `บล็อค IP Address: ${ipAddress}`);
  // Implement IP blocking logic
};

const markAsResolved = (activity: SuspiciousActivity) => {
  showToast("success", `ทำเครื่องหมายว่าแก้ไขแล้ว: ${activity.activity}`);
  // Implement mark as resolved logic
};
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
