<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6 py-12 relative overflow-hidden"
  >
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Dynamic Tech Grid Pattern -->
      <div class="absolute inset-0 opacity-30">
        <div
          class="h-full w-full animate-pulse"
          style="
            background-image: url('data:image/svg+xml,%3csvg width=%27100%27 height=%27100%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cdefs%3e%3cpattern id=%27grid%27 patternUnits=%27userSpaceOnUse%27 width=%2750%27 height=%2750%27%3e%3crect x=%270%27 y=%270%27 width=%27100%25%27 height=%27100%25%27 fill=%27transparent%27/%3e%3cpath d=%27M0 25h50M25 0v50%27 stroke-width=%271%27 stroke=%27hsla(220,100%25,60%25,0.4)%27/%3e%3c/pattern%3e%3c/defs%3e%3crect width=%27100%25%27 height=%27100%25%27 fill=%27url(%23grid)%27/%3e%3c/svg%3e');
          "
        ></div>
      </div>

      <!-- Floating Geometric Shapes -->
      <div
        class="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse floating-orb-1"
      ></div>
      <div
        class="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse floating-orb-2"
      ></div>
      <div
        class="absolute top-1/2 left-1/3 w-60 h-60 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 rounded-full blur-3xl animate-pulse floating-orb-3"
      ></div>

      <!-- Animated Lines -->
      <div
        class="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/50 to-transparent animate-pulse"
      ></div>
      <div
        class="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent animate-pulse"
        style="animation-delay: 1s"
      ></div>
    </div>

    <!-- Main Login Container -->
    <div
      class="relative z-10 w-full max-w-md transform transition-all duration-700 hover:scale-105"
    >
      <!-- Futuristic Login Card -->
      <div
        class="backdrop-blur-2xl bg-white/5 border border-white/20 rounded-3xl shadow-2xl p-8 space-y-8 relative overflow-hidden group"
      >
        <!-- Dynamic Border Glow -->
        <div
          class="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
        ></div>

        <!-- Header Section with Animation -->
        <div class="text-center space-y-6">
          <!-- Cyberpunk Logo -->
          <div class="relative mx-auto w-24 h-24 mb-8">
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-70 animate-pulse"
            ></div>
            <div
              class="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl p-5 flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500"
            >
              <svg
                class="w-14 h-14 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>

          <!-- Animated Title -->
          <div class="space-y-3">
            <h1
              class="text-4xl font-black bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent animate-pulse"
            >
              QUANTUM ACCESS
            </h1>
            <div class="flex items-center justify-center gap-3">
              <div
                class="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1"
              ></div>
              <span class="text-blue-300/80 text-sm font-medium tracking-wider"
                >SECURE PORTAL</span
              >
              <div
                class="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1"
              ></div>
            </div>
            <p class="text-blue-200/70 text-sm">
              Boxing Ticket Management System
            </p>
          </div>
        </div>

        <!-- Enhanced Form Section -->
        <div class="space-y-6">
          <!-- Email Field with Advanced Styling -->
          <div class="space-y-3">
            <label
              class="text-sm font-bold text-blue-200 flex items-center gap-3 tracking-wide"
            >
              <div
                class="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              EMAIL AUTHENTICATION
            </label>
            <div class="relative group">
              <input
                v-model="pageData.email"
                type="email"
                placeholder="Enter your quantum ID"
                class="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-blue-200/50 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-500 backdrop-blur-sm font-medium group-hover:bg-white/15"
                required
              />
              <div
                class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-cyan-500/10 to-purple-500/0 pointer-events-none group-focus-within:opacity-100 opacity-0 transition-opacity duration-300"
              ></div>
            </div>
          </div>

          <!-- Password Field with Advanced Styling -->
          <div class="space-y-3">
            <label
              class="text-sm font-bold text-blue-200 flex items-center gap-3 tracking-wide"
            >
              <div
                class="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              BIOMETRIC PASSKEY
            </label>
            <div class="relative group">
              <input
                v-model="pageData.password"
                type="password"
                placeholder="Enter neural security code"
                class="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-blue-200/50 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30 transition-all duration-500 backdrop-blur-sm font-medium group-hover:bg-white/15"
                required
              />
              <div
                class="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-pink-500/10 to-cyan-500/0 pointer-events-none group-focus-within:opacity-100 opacity-0 transition-opacity duration-300"
              ></div>
            </div>
          </div>

          <!-- Advanced Login Button -->
          <button
            @click="login"
            :disabled="
              !pageData.email || !pageData.password || pageData.loading
            "
            class="w-full relative group mt-8"
          >
            <!-- Glowing Background -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"
            ></div>

            <!-- Button Content -->
            <div
              class="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-500 hover:via-purple-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-800 text-white font-black py-5 px-8 rounded-2xl transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4"
            >
              <!-- Loading Animation -->
              <div
                v-if="pageData.loading"
                class="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"
              ></div>

              <!-- Access Icon -->
              <svg
                v-else
                class="w-6 h-6 group-hover:rotate-180 transition-transform duration-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>

              <!-- Button Text -->
              <span class="text-lg tracking-wider">
                {{ pageData.loading ? "AUTHENTICATING..." : "INITIATE ACCESS" }}
              </span>
            </div>

            <!-- Ripple Effect -->
            <div
              class="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
            >
              <div
                class="absolute inset-0 bg-white/20 scale-0 group-active:scale-100 transition-transform duration-300 rounded-full"
              ></div>
            </div>
          </button>

          <!-- Password Change Button -->
          <button
            @click="showChangePassword = true"
            class="w-full relative group mt-4"
          >
            <div
              class="relative bg-white/10 hover:bg-white/20 border border-white/20 hover:border-cyan-400/50 text-blue-200 hover:text-white font-bold py-4 px-6 rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 backdrop-blur-sm group-hover:backdrop-blur-md"
            >
              <svg
                class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"
                />
              </svg>
              <span class="tracking-wide">MODIFY CREDENTIALS</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Futuristic Test Data Section -->
    <div class="mt-8 space-y-4">
      <!-- Admin Account -->
      <div
        class="backdrop-blur-md bg-amber-500/10 border border-amber-400/30 rounded-2xl p-4 space-y-2"
      >
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span class="text-amber-200 font-bold text-sm tracking-wider"
            >ADMIN ACCESS</span
          >
        </div>
        <div class="text-amber-100 text-sm space-y-1">
          <p>Email: admin@example.com</p>
          <p>Password: admin1234</p>
        </div>
      </div>

      <!-- Staff Account -->
      <div
        class="backdrop-blur-md bg-blue-500/10 border border-blue-400/30 rounded-2xl p-4 space-y-2"
      >
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <span class="text-blue-200 font-bold text-sm tracking-wider"
            >STAFF ACCESS</span
          >
        </div>
        <div class="text-blue-100 text-sm space-y-1">
          <p>Email: staff01@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Ultra Modern Password Change Modal -->
  <div
    v-if="showChangePassword"
    class="fixed inset-0 z-50 flex items-center justify-center px-6 py-12"
  >
    <!-- Dynamic Backdrop -->
    <div
      class="absolute inset-0 bg-black/60 backdrop-blur-2xl"
      @click="showChangePassword = false"
    ></div>

    <!-- Modal Content -->
    <div
      class="relative z-10 w-full max-w-lg transform transition-all duration-700 scale-110"
    >
      <div
        class="backdrop-blur-3xl bg-white/5 border border-white/20 rounded-3xl shadow-2xl p-8 space-y-8 relative overflow-hidden"
      >
        <!-- Dynamic Border Animation -->
        <div
          class="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-cyan-500/30 blur-sm animate-pulse"
        ></div>

        <!-- Modal Header -->
        <div class="relative text-center space-y-6">
          <!-- Security Icon -->
          <div
            class="mx-auto w-20 h-20 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-3xl p-4 flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500"
          >
            <svg
              class="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>

          <div class="space-y-2">
            <h2
              class="text-3xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
            >
              SECURITY OVERRIDE
            </h2>
            <p class="text-purple-200/80 text-sm">
              Modify Authentication Credentials
            </p>
          </div>
        </div>

        <!-- Form Fields -->
        <div class="space-y-6">
          <!-- Email Field -->
          <div class="space-y-3">
            <label
              class="text-sm font-bold text-purple-200 flex items-center gap-2 tracking-wide"
            >
              <div
                class="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              EMAIL ID
            </label>
            <input
              v-model="changePasswordData.email"
              type="email"
              placeholder="Enter registered email"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30 transition-all duration-300 backdrop-blur-sm"
              required
            />
          </div>

          <!-- Current Password -->
          <div class="space-y-3">
            <label
              class="text-sm font-bold text-purple-200 flex items-center gap-2 tracking-wide"
            >
              <div
                class="w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              CURRENT PASSKEY
            </label>
            <input
              v-model="changePasswordData.oldPassword"
              type="password"
              placeholder="Enter current password"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200/50 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-400/30 transition-all duration-300 backdrop-blur-sm"
              required
            />
          </div>

          <!-- New Password -->
          <div class="space-y-3">
            <label
              class="text-sm font-bold text-purple-200 flex items-center gap-2 tracking-wide"
            >
              <div
                class="w-5 h-5 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              NEW PASSKEY
            </label>
            <input
              v-model="changePasswordData.newPassword"
              type="password"
              placeholder="Enter new secure password"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200/50 focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/30 transition-all duration-300 backdrop-blur-sm"
              required
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 pt-6">
          <!-- Cancel Button -->
          <button
            @click="showChangePassword = false"
            class="flex-1 relative group"
          >
            <div
              class="relative bg-white/10 hover:bg-white/20 border border-white/20 hover:border-red-400/50 text-red-200 hover:text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>CANCEL</span>
            </div>
          </button>

          <!-- Save Button -->
          <button
            @click="changePassword"
            :disabled="changePasswordData.loading"
            class="flex-1 relative group"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-green-600 via-cyan-600 to-blue-600 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div
              class="relative bg-gradient-to-r from-green-600 via-cyan-600 to-blue-600 hover:from-green-500 hover:via-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              <div
                v-if="changePasswordData.loading"
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{{
                changePasswordData.loading ? "UPDATING..." : "UPDATE"
              }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
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

<style scoped>
/* Advanced Animations for Futuristic Feel */
@keyframes floating-orb-1 {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(20px, -20px) rotate(90deg);
  }
  50% {
    transform: translate(-10px, -30px) rotate(180deg);
  }
  75% {
    transform: translate(-25px, 10px) rotate(270deg);
  }
}

@keyframes floating-orb-2 {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(-30px, 20px) rotate(-90deg);
  }
  50% {
    transform: translate(20px, 40px) rotate(-180deg);
  }
  75% {
    transform: translate(40px, -15px) rotate(-270deg);
  }
}

@keyframes floating-orb-3 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(15px, -25px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 15px) scale(0.9);
  }
}

.floating-orb-1 {
  animation: floating-orb-1 20s ease-in-out infinite;
}

.floating-orb-2 {
  animation: floating-orb-2 25s ease-in-out infinite;
}

.floating-orb-3 {
  animation: floating-orb-3 15s ease-in-out infinite;
}

/* Glowing Border Effect */
@keyframes border-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5),
      0 0 40px rgba(147, 51, 234, 0.3), 0 0 60px rgba(6, 182, 212, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(147, 51, 234, 0.6),
      0 0 60px rgba(59, 130, 246, 0.4), 0 0 90px rgba(6, 182, 212, 0.3);
  }
}

/* Pulsing Grid Animation */
@keyframes grid-pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

/* Advanced Hover Effects */
.group:hover .floating-orb-1,
.group:hover .floating-orb-2,
.group:hover .floating-orb-3 {
  animation-play-state: paused;
}

/* Smooth Transitions */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced Focus States */
input:focus {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

button:active {
  transform: translateY(-1px);
}

/* Modal Entrance Animation */
@keyframes modal-entrance {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(50px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Backdrop Animation */
@keyframes backdrop-entrance {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Enhanced Glass Effect */
.backdrop-blur-2xl {
  backdrop-filter: blur(40px);
}

.backdrop-blur-3xl {
  backdrop-filter: blur(60px);
}

/* Advanced Text Glow */
.text-glow {
  text-shadow: 0 0 10px currentColor, 0 0 20px currentColor,
    0 0 30px currentColor;
}

/* Custom Scrollbar for Modal Content */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #2563eb, #7c3aed);
}

/* Responsive Adjustments */
@media (max-width: 640px) {
  .floating-orb-1,
  .floating-orb-2,
  .floating-orb-3 {
    display: none;
  }
}
</style>
