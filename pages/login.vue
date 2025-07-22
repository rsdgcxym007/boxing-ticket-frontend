<template>
  <div
    class="min-h-screen bg-[#0f172a] flex items-center justify-center px-6 py-12"
  >
    <BaseCard class="w-full max-w-md bg-white shadow-xl p-8 space-y-6">
      <template #header>
        <h1 class="text-3xl font-bold text-center text-gray-900">
          เข้าสู่ระบบ
        </h1>
      </template>

      <!-- ช่องกรอกข้อมูล -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            อีเมล
          </label>
          <BaseInput
            v-model="pageData.email"
            type="email"
            placeholder="กรอกอีเมลของคุณ"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            รหัสผ่าน
          </label>
          <BaseInput
            v-model="pageData.password"
            type="password"
            placeholder="กรอกรหัสผ่าน"
            required
          />
        </div>
      </div>

      <!-- ปุ่มเข้าสู่ระบบ -->
      <BaseButton
        @click="login"
        :loading="pageData.loading"
        :disabled="!pageData.email || !pageData.password"
        variant="primary"
        size="md"
        class="w-full h-full"
      >
        เข้าสู่ระบบ
      </BaseButton>

      <!-- ปุ่มเปลี่ยนรหัสผ่าน -->
      <BaseButton
        @click="showChangePassword = true"
        variant="secondary"
        size="md"
        class="w-full mt-2"
      >
        เปลี่ยนรหัสผ่าน
      </BaseButton>

      <!-- Modal เปลี่ยนรหัสผ่าน -->
      <BaseModal
        v-if="showChangePassword"
        :isOpen="showChangePassword"
        @close="showChangePassword = false"
      >
        <template #header>
          <h2 class="text-xl font-bold text-center">เปลี่ยนรหัสผ่าน</h2>
        </template>
        <div class="space-y-4 p-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >อีเมล</label
            >
            <BaseInput
              v-model="changePasswordData.email"
              type="email"
              placeholder="กรอกอีเมล"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >รหัสผ่านเดิม</label
            >
            <BaseInput
              v-model="changePasswordData.oldPassword"
              type="password"
              placeholder="รหัสผ่านเดิม"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >รหัสผ่านใหม่</label
            >
            <BaseInput
              v-model="changePasswordData.newPassword"
              type="password"
              placeholder="รหัสผ่านใหม่"
              required
            />
          </div>
        </div>
        <template #footer>
          <div class="flex gap-2 justify-end">
            <BaseButton @click="showChangePassword = false" variant="secondary"
              >ยกเลิก</BaseButton
            >
            <BaseButton
              @click="changePassword"
              :loading="changePasswordData.loading"
              variant="primary"
              >บันทึก</BaseButton
            >
          </div>
        </template>
      </BaseModal>

      <!-- ข้อมูลทดสอบ -->
      <BaseAlert type="warning" class="text-sm mt-5 mb-3">
        <p><strong>ข้อมูลทดสอบ: role Admin</strong></p>
        <p>Email: admin@example.com</p>
        <p>Password: admin1234</p>
      </BaseAlert>
      <BaseAlert type="warning" class="text-sm">
        <p><strong>ข้อมูลทดสอบ: role Staff</strong></p>
        <p>Email: staff01@example.com</p>
        <p>Password: password123</p>
      </BaseAlert>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
// นำเข้า composables และ utilities ที่จำเป็น
import { reactive } from "vue";
import { useSingleToast } from "../composables/useSingleToast";
import { useApi } from "../composables/useApi";
import { useRouter } from "vue-router";
import { useRuntimeConfig } from "nuxt/app";

// ตั้งค่าการเชื่อมต่อ API
const config = useRuntimeConfig();
const base = config.public.apiBase;

// ข้อมูลฟอร์ม login
const pageData = reactive({
  email: "admin@example.com",
  password: "admin1234",
  loading: false,
});

// State สำหรับ modal เปลี่ยนรหัสผ่าน
import { ref } from "vue";
const showChangePassword = ref(false);
const changePasswordData = reactive({
  email: "",
  oldPassword: "",
  newPassword: "",
  loading: false,
});

// ใช้ composables
const { showToast } = useSingleToast();
const router = useRouter();
const { post } = useApi();

/**
 * ฟังก์ชันเปลี่ยนรหัสผ่าน (ต้องอยู่นอก login)
 */
const changePassword = async () => {
  changePasswordData.loading = true;
  try {
    const token = localStorage.getItem("token");
    // PATCH change password
    const res = await fetch(`${base}/api/v1/users/change-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: changePasswordData.email,
        oldPassword: changePasswordData.oldPassword,
        newPassword: changePasswordData.newPassword,
      }),
    });
    if (!res.ok) {
      // Try to parse error response
      let errorData;
      try {
        errorData = await res.json();
      } catch {}
      if (errorData && errorData.code === "NO_PASSWORD") {
        showToast(
          "error",
          "บัญชีนี้ยังไม่ได้ตั้งรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบ"
        );
        changePasswordData.loading = false;
        return;
      }
      throw new Error("เปลี่ยนรหัสผ่านไม่สำเร็จ");
    }
    // // Send email notification
    // await fetch(`${base}/users/send-password-changed-email`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({
    //     email: changePasswordData.email,
    //   }),
    // });
    // showToast("success", "✅ เปลี่ยนรหัสผ่านสำเร็จ และส่งอีเมลแจ้งเตือนแล้ว");
    showChangePassword.value = false;
    // reset form
    changePasswordData.email = "";
    changePasswordData.oldPassword = "";
    changePasswordData.newPassword = "";
  } catch (err: any) {
    showToast("error", `🚫 ${err.message || "เปลี่ยนรหัสผ่านล้มเหลว"}`);
  } finally {
    changePasswordData.loading = false;
  }
};

/**
 * ฟังก์ชันสำหรับเข้าสู่ระบบ
 * จะเรียก API เพื่อตรวจสอบข้อมูลและบันทึก token
 */
const login = async () => {
  pageData.loading = true;

  try {
    const endpoints = ["/auth/login"];

    let success = false;
    let data;

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(`${base}/api/v1${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: pageData.email,
            password: pageData.password,
          }),
        });

        if (res.ok) {
          const responseText = await res.text();

          try {
            data = JSON.parse(responseText);
            success = true;
            break;
          } catch (jsonError) {
            console.log("❌ ไม่สามารถแปลง response เป็น JSON:", jsonError);
            throw new Error("API ส่งกลับข้อมูลที่ไม่ใช่ JSON");
          }
        } else {
          // Try to parse error response
          let errorData;
          try {
            errorData = await res.json();
          } catch {}
          if (errorData && errorData.code === "NO_PASSWORD") {
            showToast(
              "error",
              "บัญชีนี้ยังไม่ได้ตั้งรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบ"
            );
            pageData.loading = false;
            return;
          }
          console.log(`❌ ${endpoint} ล้มเหลว:`, res.status, res.statusText);
        }
      } catch (fetchError) {
        console.log(`❌ Error เรียก ${endpoint}:`, fetchError);
      }
    }

    if (!success) {
      throw new Error(
        "ไม่สามารถเชื่อมต่อ API ได้ กรุณาตรวจสอบว่า Backend Server ทำงานอยู่"
      );
    }

    // ตรวจสอบว่ามี access_token หรือไม่
    if (!data.data.access_token && !data.data.token) {
      throw new Error("ไม่พบ access_token ในการตอบกลับ");
    }

    // บันทึกข้อมูลการเข้าสู่ระบบ
    const token = data.data.access_token || data.data.token;
    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify(data.data.user || data.data?.user || {})
    );

    showToast("success", "🎉 เข้าสู่ระบบสำเร็จ");
    console.log("🏠 กำลังเปลี่ยนเส้นทางไปหน้าแรก...");

    // เปลี่ยนเส้นทางไปหน้าแรก
    await router.push("/");
  } catch (err: any) {
    console.error("❌ เกิดข้อผิดพลาดในการเข้าสู่ระบบ:", err);

    // แสดงข้อความแจ้งเตือนที่เหมาะสม
    let errorMessage = "เข้าสู่ระบบล้มเหลว";

    if (err.message) {
      errorMessage = err.message;
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }

    showToast("error", `🚫 ${errorMessage}`);

    // แสดงข้อมูลเพิ่มเติมสำหรับการ debug
    console.log("🔍 ข้อมูลการ debug:");
    console.log("- API Base URL:", base);
    console.log("- Error:", err);
  } finally {
    pageData.loading = false;
  }
};
</script>
