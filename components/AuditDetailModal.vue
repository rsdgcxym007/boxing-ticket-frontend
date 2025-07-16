<template>
  <BaseModal
    :isOpen="isOpen"
    @close="$emit('close')"
    title="รายละเอียด Audit Log"
    size="xl"
  >
    <div v-if="auditLog" class="space-y-6">
      <!-- Header Info -->
      <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div
          class="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center"
        >
          <i class="mdi mdi-shield-search text-white text-xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">
            {{ getActionLabel(auditLog.action) }}
          </h3>
          <p class="text-sm text-gray-600">
            {{ formatDateTime(auditLog.timestamp) }}
          </p>
        </div>
      </div>

      <!-- User Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <h4
            class="text-md font-semibold text-gray-900 flex items-center gap-2"
          >
            <i class="mdi mdi-account text-blue-500"></i>
            ข้อมูลผู้ใช้
          </h4>
          <div class="bg-blue-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-600">ชื่อ:</span>
              <span class="text-sm text-gray-900">{{
                JSON.parse(auditLog.metadata).user || "ไม่ระบุ"
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-600">อีเมล:</span>
              <span class="text-sm text-gray-900">{{
                JSON.parse(auditLog.metadata).email || "ไม่ระบุ"
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-600">บทบาท:</span>
              <span
                :class="getRoleBadgeClass(auditLog.user?.role)"
                class="text-xs px-2 py-1 rounded-full"
              >
                {{ getRoleLabel(auditLog.user?.role) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-600">User ID:</span>
              <span class="text-sm text-gray-900 font-mono">{{
                auditLog.userId
              }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <h4
            class="text-md font-semibold text-gray-900 flex items-center gap-2"
          >
            <i class="mdi mdi-information text-green-500"></i>
            ข้อมูลการกระทำ
          </h4>
          <div class="bg-green-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-600">การกระทำ:</span>
              <span
                :class="getActionBadgeClass(auditLog.action)"
                class="text-xs px-2 py-1 rounded-full"
              >
                {{ getActionLabel(auditLog.action) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-600"
                >ประเภทข้อมูล:</span
              >
              <span class="text-sm text-gray-900">{{
                getEntityTypeLabel(auditLog.entityType)
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-600">Entity ID:</span>
              <span class="text-sm text-gray-900 font-mono">{{
                auditLog.entityId
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-600">IP Address:</span>
              <span class="text-sm text-gray-900 font-mono">{{
                auditLog.ipAddress
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- User Agent -->
      <div class="space-y-4">
        <h4 class="text-md font-semibold text-gray-900 flex items-center gap-2">
          <i class="mdi mdi-web text-purple-500"></i>
          ข้อมูลเบราว์เซอร์
        </h4>
        <div class="bg-purple-50 p-4 rounded-lg">
          <p class="text-sm text-gray-900 font-mono break-all">
            {{ auditLog.userAgent }}
          </p>
        </div>
      </div>

      <!-- Data Changes (if available) -->
      <div v-if="auditLog.oldData || auditLog.newData" class="space-y-4">
        <h4 class="text-md font-semibold text-gray-900 flex items-center gap-2">
          <i class="mdi mdi-file-compare text-orange-500"></i>
          การเปลี่ยนแปลงข้อมูล
        </h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Old Data -->
          <div v-if="auditLog.oldData" class="space-y-2">
            <h5
              class="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <i class="mdi mdi-file-remove text-red-500"></i>
              ข้อมูลเดิม
            </h5>
            <div class="bg-red-50 border border-red-200 rounded-lg p-3">
              <pre class="text-xs text-gray-900 whitespace-pre-wrap">{{
                formatJson(auditLog.oldData)
              }}</pre>
            </div>
          </div>

          <!-- New Data -->
          <div v-if="auditLog.newData" class="space-y-2">
            <h5
              class="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <i class="mdi mdi-file-plus text-green-500"></i>
              ข้อมูลใหม่
            </h5>
            <div class="bg-green-50 border border-green-200 rounded-lg p-3">
              <pre class="text-xs text-gray-900 whitespace-pre-wrap">{{
                formatJson(auditLog.newData)
              }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Audit ID and Timestamp -->
      <div class="border-t pt-4">
        <div class="flex justify-between items-center text-xs text-gray-500">
          <span>Audit ID: {{ auditLog.id }}</span>
          <span>{{ formatDateTime(auditLog.timestamp) }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <BaseButton @click="$emit('close')" variant="primary" color="gray">
          ปิด
        </BaseButton>
        <BaseButton
          @click="exportLog"
          color="indigo"
          class="flex items-center gap-2"
        >
          <i class="mdi mdi-download"></i>
          ส่งออก
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import type { AuditLog } from "../types/order";

const props = defineProps({
  auditLog: {
    type: Object as () => AuditLog | null,
    default: null,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  close: [];
}>();

// Utility Functions
const getRoleLabel = (role?: string) => {
  const labels: Record<string, string> = {
    admin: "ผู้ดูแลระบบ",
    manager: "ผู้จัดการ",
    supervisor: "หัวหน้างาน",
    staff: "พนักงาน",
    user: "ผู้ใช้",
    guest: "ผู้เยี่ยมชม",
  };
  return labels[role || ""] || role || "ไม่ระบุ";
};

const getRoleBadgeClass = (role?: string) => {
  const classes: Record<string, string> = {
    admin: "bg-purple-100 text-purple-800",
    manager: "bg-blue-100 text-blue-800",
    supervisor: "bg-green-100 text-green-800",
    staff: "bg-gray-100 text-gray-800",
    user: "bg-indigo-100 text-indigo-800",
    guest: "bg-orange-100 text-orange-800",
  };
  return classes[role || ""] || "bg-gray-100 text-gray-800";
};

const getActionLabel = (action: string) => {
  const labels: Record<string, string> = {
    CREATE: "สร้าง",
    UPDATE: "แก้ไข",
    DELETE: "ลบ",
    LOGIN: "เข้าสู่ระบบ",
    LOGOUT: "ออกจากระบบ",
    VIEW: "ดู",
    DOWNLOAD: "ดาวน์โหลด",
    EXPORT: "ส่งออก",
    IMPORT: "นำเข้า",
  };
  return labels[action] || action;
};

const getActionBadgeClass = (action: string) => {
  const classes: Record<string, string> = {
    CREATE: "bg-green-100 text-green-800",
    UPDATE: "bg-blue-100 text-blue-800",
    DELETE: "bg-red-100 text-red-800",
    LOGIN: "bg-green-100 text-green-800",
    LOGOUT: "bg-orange-100 text-orange-800",
    VIEW: "bg-gray-100 text-gray-800",
    DOWNLOAD: "bg-indigo-100 text-indigo-800",
    EXPORT: "bg-purple-100 text-purple-800",
    IMPORT: "bg-blue-100 text-blue-800",
  };
  return classes[action] || "bg-gray-100 text-gray-800";
};

const getEntityTypeLabel = (entityType: string) => {
  const labels: Record<string, string> = {
    USER: "ผู้ใช้",
    ORDER: "คำสั่งซื้อ",
    PAYMENT: "การชำระเงิน",
    TICKET: "ตั๋ว",
    SEAT: "ที่นั่ง",
    STAFF: "พนักงาน",
    REFERRER: "ผู้แนะนำ",
    SYSTEM: "ระบบ",
  };
  return labels[entityType] || entityType;
};

const formatDateTime = (date: string) => {
  return dayjs(date).format("DD/MM/YYYY HH:mm:ss");
};

const formatJson = (obj: any) => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
};

const exportLog = () => {
  if (!props.auditLog) return;

  const data = {
    id: props.auditLog.id,
    timestamp: props.auditLog.timestamp,
    user: props.auditLog.user,
    action: props.auditLog.action,
    entityType: props.auditLog.entityType,
    entityId: props.auditLog.entityId,
    ipAddress: props.auditLog.ipAddress,
    userAgent: props.auditLog.userAgent,
    oldData: props.auditLog.oldData,
    newData: props.auditLog.newData,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit-log-${props.auditLog.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
pre {
  max-height: 200px;
  overflow-y: auto;
}
</style>
