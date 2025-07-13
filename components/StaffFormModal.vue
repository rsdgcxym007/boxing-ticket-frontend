<template>
  <BaseModal
    :isOpen="isOpen"
    :title="modalTitle"
    size="lg"
    @update:isOpen="isOpen = $event"
    @close="closeModal"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Personal Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput
          v-model="form.firstName"
          label="ชื่อ"
          placeholder="กรอกชื่อ"
          required
          :error="errors.firstName"
        />
        <BaseInput
          v-model="form.lastName"
          label="นามสกุล"
          placeholder="กรอกนามสกุล"
          required
          :error="errors.lastName"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput
          v-model="form.email"
          label="อีเมล"
          type="email"
          placeholder="example@company.com"
          required
          :error="errors.email"
        />
        <BaseInput
          v-model="form.phone"
          label="เบอร์โทรศัพท์"
          placeholder="08x-xxx-xxxx"
          :error="errors.phone"
        />
      </div>

      <!-- Role and Department -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseSelect
          v-model="form.role"
          label="ตำแหน่ง"
          :options="roleOptions"
          placeholder="เลือกตำแหน่ง"
          searchable
          clearable
          required
          :error="errors.role"
        />
        <BaseSelect
          v-model="form.department"
          label="แผนก"
          :options="departmentOptions"
          placeholder="เลือกแผนก"
          searchable
          clearable
          :error="errors.department"
        />
      </div>

      <BaseInput
        v-model="form.position"
        label="ตำแหน่งงาน"
        placeholder="กรอกตำแหน่งงาน"
        :error="errors.position"
      />

      <!-- Permissions -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          สิทธิ์การใช้งาน
        </label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label
            v-for="permission in availablePermissions"
            :key="permission.value"
            class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              :value="permission.value"
              v-model="form.permissions"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div class="flex-1">
              <div class="font-medium text-sm text-gray-900">
                {{ permission.label }}
              </div>
              <div class="text-xs text-gray-500">
                {{ permission.description }}
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-4 pt-6 border-t">
        <BaseButton
          type="button"
          @click="closeModal"
          variant="outline"
          color="gray"
        >
          ยกเลิก
        </BaseButton>
        <BaseButton type="submit" color="blue" :loading="saving">
          {{ isEditing ? "บันทึกการแก้ไข" : "สร้างพนักงาน" }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from "vue";
import { useToast } from "vue-toastification";
import {
  useStaff,
  type Staff,
  type CreateStaffData,
  type UpdateStaffData,
} from "../composables/useStaff";

interface Props {
  modelValue: boolean;
  staff?: Staff | null;
  departments: string[];
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "saved"): void;
  (e: "close"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const toast = useToast();
const { createStaff, updateStaff } = useStaff();

// State
const saving = ref(false);
const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  department: "",
  position: "",
  permissions: [] as string[],
});

const errors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  department: "",
  position: "",
});

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const isEditing = computed(() => !!props.staff);

const modalTitle = computed(() =>
  isEditing.value ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มพนักงานใหม่"
);

// Options
const roleOptions = [
  {
    value: "admin",
    label: "ผู้ดูแลระบบ",
    icon: "mdi mdi-shield-crown",
    badge: "Admin",
  },
  {
    value: "manager",
    label: "ผู้จัดการ",
    icon: "mdi mdi-account-tie",
    badge: "Manager",
  },
  {
    value: "supervisor",
    label: "หัวหน้างาน",
    icon: "mdi mdi-account-star",
    badge: "Supervisor",
  },
  { value: "staff", label: "พนักงาน", icon: "mdi mdi-account", badge: "Staff" },
];

const departmentOptions = computed(() => [
  ...props.departments.map((dept) => ({
    value: dept,
    label: dept,
    icon: "mdi mdi-domain",
  })),
]);

const availablePermissions = [
  {
    value: "view_analytics",
    label: "ดูรายงานและวิเคราะห์",
    description: "สามารถดูรายงานต่าง ๆ และข้อมูลวิเคราะห์",
  },
  {
    value: "export_reports",
    label: "ส่งออกรายงาน",
    description: "สามารถส่งออกรายงานในรูปแบบต่าง ๆ",
  },
  {
    value: "manage_staff",
    label: "จัดการพนักงาน",
    description: "สามารถเพิ่ม แก้ไข ลบข้อมูลพนักงาน",
  },
  {
    value: "view_staff",
    label: "ดูข้อมูลพนักงาน",
    description: "สามารถดูข้อมูลพนักงานทั้งหมด",
  },
  {
    value: "manage_orders",
    label: "จัดการออเดอร์",
    description: "สามารถสร้าง แก้ไข ยกเลิกออเดอร์",
  },
  {
    value: "cancel_orders",
    label: "ยกเลิกออเดอร์",
    description: "สามารถยกเลิกออเดอร์ที่มีอยู่",
  },
  {
    value: "refund_orders",
    label: "คืนเงินออเดอร์",
    description: "สามารถทำการคืนเงินให้ลูกค้า",
  },
  {
    value: "system_settings",
    label: "ตั้งค่าระบบ",
    description: "สามารถแก้ไขการตั้งค่าระบบ",
  },
  {
    value: "audit_logs",
    label: "ดู Audit Logs",
    description: "สามารถดูประวัติการใช้งานระบบ",
  },
  {
    value: "view_performance",
    label: "ดูข้อมูลประสิทธิภาพ",
    description: "สามารถดูข้อมูลประสิทธิภาพของระบบ",
  },
  {
    value: "system_monitoring",
    label: "ติดตามระบบ",
    description: "สามารถติดตามสถานะการทำงานของระบบ",
  },
];

// Methods
const resetForm = () => {
  form.firstName = "";
  form.lastName = "";
  form.email = "";
  form.phone = "";
  form.role = "";
  form.department = "";
  form.position = "";
  form.permissions = [];

  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });
};

const populateForm = (staff: Staff) => {
  form.firstName = staff.firstName;
  form.lastName = staff.lastName;
  form.email = staff.email;
  form.phone = staff.phone || "";
  form.role = staff.role;
  form.department = staff.department || "";
  form.position = staff.position || "";
  form.permissions = [...staff.permissions];
};

const validateForm = () => {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });

  if (!form.firstName.trim()) {
    errors.firstName = "กรุณากรอกชื่อ";
    isValid = false;
  }

  if (!form.lastName.trim()) {
    errors.lastName = "กรุณากรอกนามสกุล";
    isValid = false;
  }

  if (!form.email.trim()) {
    errors.email = "กรุณากรอกอีเมล";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    isValid = false;
  }

  if (!form.role) {
    errors.role = "กรุณาเลือกตำแหน่ง";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    saving.value = true;

    if (isEditing.value && props.staff) {
      const updateData: UpdateStaffData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        department: form.department || undefined,
        position: form.position || undefined,
        permissions: form.permissions,
      };

      await updateStaff(props.staff.id, updateData);
      toast.success("อัปเดตข้อมูลพนักงานสำเร็จ");
    } else {
      const createData: CreateStaffData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        role: form.role as any,
        department: form.department || undefined,
        position: form.position || undefined,
        permissions: form.permissions,
      };

      await createStaff(createData);
      toast.success("สร้างพนักงานใหม่สำเร็จ");
    }

    emit("saved");
    closeModal();
  } catch (error) {
    console.error("Failed to save staff:", error);
  } finally {
    saving.value = false;
  }
};

const closeModal = () => {
  emit("update:modelValue", false);
  emit("close");
  resetForm();
};

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      if (props.staff) {
        populateForm(props.staff);
      } else {
        resetForm();
      }
    }
  }
);
</script>

<style scoped>
/* Custom styles for checkbox */
input[type="checkbox"]:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

input[type="checkbox"]:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>
