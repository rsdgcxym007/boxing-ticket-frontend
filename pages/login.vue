<template>
  <div
    class="min-h-screen bg-[#0f172a] flex items-center justify-center px-6 py-12"
  >
    <div class="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-6">
      <h1 class="text-3xl font-bold text-center text-gray-900">เข้าสู่ระบบ</h1>

      <!-- ✅ ช่อง input เรียงแนวตั้ง -->
      <div class="flex flex-col gap-4">
        <div class="relative">
          <span
            class="absolute inset-y-0 left-3 flex items-center text-gray-400"
          >
            <i class="fas fa-envelope"></i>
          </span>
          <input
            v-model="pageData.email"
            type="email"
            placeholder="อีเมลของคุณ"
            class="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div class="relative">
          <span
            class="absolute inset-y-0 left-3 flex items-center text-gray-400"
          >
            <i class="fas fa-lock"></i>
          </span>
          <input
            v-model="pageData.password"
            type="password"
            placeholder="รหัสผ่าน"
            class="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      <button
        @click="login"
        class="w-full py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-200"
        :disabled="pageData.loading"
      >
        <span v-if="!pageData.loading">เข้าสู่ระบบ</span>
        <span v-else>กำลังโหลด...</span>
      </button>

      <div class="text-center text-sm text-gray-500">
        ยังไม่มีบัญชี?
        <NuxtLink
          to="/register"
          class="text-blue-600 hover:underline font-semibold"
        >
          สมัครสมาชิก
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useToast } from "vue-toastification";
import { useApi } from "../composables/useApi";
import { useRouter } from "vue-router";
import { useRuntimeConfig } from "nuxt/app";
const config = useRuntimeConfig();
const base = config.public.apiBase;
const pageData = reactive({
  email: "newuser@gmail.com",
  password: "secure123",
  loading: false,
});

const toast = useToast();
const router = useRouter();
const { post } = useApi();

const login = async () => {
  pageData.loading = true;

  try {
    const res = await fetch(`${base}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: pageData.email,
        password: pageData.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "เข้าสู่ระบบล้มเหลว");
    }

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    toast.success("เข้าสู่ระบบสำเร็จ");
    router.push("/");
  } catch (err: any) {
    toast.error(`${err.message || "เข้าสู่ระบบล้มเหลว"}`);
  } finally {
    pageData.loading = false;
  }
};
</script>
