<template>
  <div class="login-page">
    <!-- Background -->
    <div class="login-background">
      <div class="bg-gradient"></div>
      <div class="bg-pattern"></div>
    </div>

    <!-- Content -->
    <div class="login-content">
      <!-- Header -->
      <div class="login-header">
        <div class="logo-container">
          <Icon icon="mdi:qrcode-scan" class="logo-icon" />
          <h1 class="logo-text">Staff Scanner</h1>
        </div>
        <p class="subtitle">เข้าสู่ระบบสำหรับเจ้าหน้าที่</p>
      </div>

      <!-- Login Form -->
      <div class="login-form-container">
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Username Field -->
          <div class="form-group">
            <label for="username" class="form-label">
              <Icon icon="mdi:account" class="label-icon" />
              Username
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              class="form-input"
              :class="{ error: errors.username }"
              placeholder="กรอก username"
              autocomplete="username"
              :disabled="isLoading"
            />
            <div v-if="errors.username" class="error-message">
              {{ errors.username }}
            </div>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label for="password" class="form-label">
              <Icon icon="mdi:lock" class="label-icon" />
              Password
            </label>
            <div class="password-input-wrapper">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ error: errors.password }"
                placeholder="กรอก password"
                autocomplete="current-password"
                :disabled="isLoading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
                :disabled="isLoading"
              >
                <Icon
                  :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
                  class="text-lg"
                />
              </button>
            </div>
            <div v-if="errors.password" class="error-message">
              {{ errors.password }}
            </div>
          </div>

          <!-- Remember Me -->
          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="form.rememberMe"
                type="checkbox"
                class="checkbox-input"
                :disabled="isLoading"
              />
              <div class="checkbox-custom"></div>
              <span>จำข้อมูลการเข้าสู่ระบบ</span>
            </label>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            class="login-button"
            :disabled="isLoading || !isFormValid"
          >
            <div v-if="isLoading" class="button-loading">
              <div class="loading-spinner"></div>
              <span>กำลังเข้าสู่ระบบ...</span>
            </div>
            <div v-else class="button-content">
              <Icon icon="mdi:login" class="text-lg" />
              <span>เข้าสู่ระบบ</span>
            </div>
          </button>

          <!-- Error Alert -->
          <div v-if="loginError" class="error-alert">
            <Icon icon="mdi:alert-circle" class="alert-icon" />
            <div class="alert-content">
              <h4>เข้าสู่ระบบไม่สำเร็จ</h4>
              <p>{{ loginError }}</p>
            </div>
          </div>
        </form>
      </div>

      <!-- Demo Credentials -->
      <div class="demo-credentials">
        <h3>
          <Icon icon="mdi:information" class="text-blue-500" />
          ข้อมูลทดสอบ
        </h3>

        <div class="credential-cards">
          <!-- Staff Account -->
          <div
            class="credential-card"
            @click="fillCredentials('staff1', 'staff123')"
          >
            <div class="credential-header">
              <Icon icon="mdi:account" class="credential-icon staff" />
              <span>Staff Account</span>
            </div>
            <div class="credential-info">
              <p>Username: staff1</p>
              <p>Password: staff123</p>
            </div>
          </div>

          <!-- Staff Account 2 -->
          <div
            class="credential-card"
            @click="fillCredentials('staff2', 'staff456')"
          >
            <div class="credential-header">
              <Icon
                icon="mdi:account-supervisor"
                class="credential-icon staff"
              />
              <span>Staff Account 2</span>
            </div>
            <div class="credential-info">
              <p>Username: staff2</p>
              <p>Password: staff456</p>
            </div>
          </div>

          <!-- Admin Account -->
          <div
            class="credential-card"
            @click="fillCredentials('admin', 'admin123')"
          >
            <div class="credential-header">
              <Icon icon="mdi:shield-account" class="credential-icon admin" />
              <span>Admin Account</span>
            </div>
            <div class="credential-info">
              <p>Username: admin</p>
              <p>Password: admin123</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="login-footer">
        <p>&copy; 2025 Patong Boxing Stadium</p>
        <p>QR Scanner System v1.0</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

// Composables
const authStore = useAuthStore();
const router = useRouter();

// Form state
const form = ref({
  username: "",
  password: "",
  rememberMe: false,
});

const showPassword = ref(false);
const isLoading = ref(false);
const loginError = ref("");

// Validation errors
const errors = ref({
  username: "",
  password: "",
});

// Computed
const isFormValid = computed(() => {
  return (
    form.value.username.trim() &&
    form.value.password.trim() &&
    !errors.value.username &&
    !errors.value.password
  );
});

// Methods
const validateForm = () => {
  errors.value = {
    username: "",
    password: "",
  };

  if (!form.value.username.trim()) {
    errors.value.username = "กรุณากรอก Username";
  }

  if (!form.value.password.trim()) {
    errors.value.password = "กรุณากรอก Password";
  } else if (form.value.password.length < 3) {
    errors.value.password = "Password ต้องมีอย่างน้อย 3 ตัวอักษร";
  }

  return !errors.value.username && !errors.value.password;
};

const handleLogin = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    isLoading.value = true;
    loginError.value = "";

    // Collect device information
    const deviceInfo = {
      deviceName: getDeviceName(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screen: {
        width: screen.width,
        height: screen.height,
      },
      timestamp: new Date().toISOString(),
    };

    console.log("📱 Attempting staff login:", {
      username: form.value.username,
      deviceInfo,
    });

    const loginData = {
      username: form.value.username,
      password: form.value.password,
      deviceInfo,
      rememberMe: form.value.rememberMe,
      loginType: "mobile_scanner",
    };

    await authStore.login(loginData);

    console.log("✅ Login successful, redirecting to scanner...");

    // Success feedback
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    // Navigate to scanner
    await router.push("/mobile/scanner");
  } catch (error) {
    console.error("❌ Login failed:", error);

    // Handle specific error codes
    const errorMessages = {
      INVALID_CREDENTIALS: "Username หรือ Password ไม่ถูกต้อง",
      ACCOUNT_DISABLED: "บัญชีถูกระงับการใช้งาน",
      ACCOUNT_LOCKED: "บัญชีถูกล็อค กรุณาติดต่อผู้ดูแลระบบ",
      INSUFFICIENT_PERMISSIONS: "ไม่มีสิทธิ์ใช้งาน QR Scanner",
      NETWORK_ERROR: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
      SERVER_ERROR: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์",
    };

    loginError.value =
      errorMessages[error.code] ||
      error.message ||
      "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";

    // Vibrate on error
    if (navigator.vibrate) {
      navigator.vibrate([100, 100, 100]);
    }
  } finally {
    isLoading.value = false;
  }
};

const fillCredentials = (username, password) => {
  form.value.username = username;
  form.value.password = password;

  // Clear errors
  errors.value = {
    username: "",
    password: "",
  };

  // Clear login error
  loginError.value = "";
};

const getDeviceName = () => {
  const userAgent = navigator.userAgent;

  if (/iPhone/.test(userAgent)) {
    return "iPhone";
  } else if (/iPad/.test(userAgent)) {
    return "iPad";
  } else if (/Android/.test(userAgent)) {
    const match = userAgent.match(/Android ([0-9.]+)/);
    return match ? `Android ${match[1]}` : "Android Device";
  } else if (/Windows/.test(userAgent)) {
    return "Windows Device";
  } else if (/Mac/.test(userAgent)) {
    return "Mac Device";
  } else {
    return "Mobile Device";
  }
};

const loadSavedCredentials = () => {
  try {
    const saved = localStorage.getItem("staff_credentials");
    if (saved) {
      const credentials = JSON.parse(saved);
      if (credentials.rememberMe) {
        form.value.username = credentials.username || "";
        form.value.rememberMe = true;
      }
    }
  } catch (error) {
    console.warn("Failed to load saved credentials:", error);
  }
};

// Lifecycle
onMounted(() => {
  // Check if already authenticated
  if (authStore.isAuthenticated) {
    router.push("/mobile/scanner");
    return;
  }

  // Load saved credentials
  loadSavedCredentials();
});

// Save credentials when rememberMe changes
watch(
  () => form.value.rememberMe,
  (rememberMe) => {
    try {
      if (rememberMe && form.value.username) {
        localStorage.setItem(
          "staff_credentials",
          JSON.stringify({
            username: form.value.username,
            rememberMe: true,
          })
        );
      } else {
        localStorage.removeItem("staff_credentials");
      }
    } catch (error) {
      console.warn("Failed to save credentials:", error);
    }
  }
);

// Page meta
definePageMeta({
  layout: "mobile",
  middleware: "guest-only",
});

useSeoMeta({
  title: "Staff Login - QR Scanner",
  description: "Staff login for QR code scanner system",
});
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Background */
.login-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
      circle at 25% 25%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 75% 75%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    );
  background-size: 100px 100px;
}

/* Content */
.login-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  padding-top: calc(2rem + env(safe-area-inset-top));
  padding-bottom: calc(2rem + env(safe-area-inset-bottom));
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.logo-text {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin: 0;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  margin: 0;
}

/* Form Container */
.login-form-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.label-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

.form-input {
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

/* Password Input */
.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s;
}

.password-toggle:hover:not(:disabled) {
  color: #374151;
}

.password-toggle:disabled {
  color: #d1d5db;
  cursor: not-allowed;
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
}

.checkbox-input:checked + .checkbox-custom {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: 600;
}

/* Login Button */
.login-button {
  padding: 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.login-button:not(:disabled):active {
  transform: translateY(1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.login-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.button-loading,
.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Error Handling */
.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
}

.error-alert {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.alert-content h4 {
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
}

.alert-content p {
  margin: 0;
  font-size: 0.8125rem;
}

/* Demo Credentials */
.demo-credentials {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  margin-bottom: 1.5rem;
}

.demo-credentials h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.credential-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.credential-card {
  padding: 0.875rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.credential-card:active {
  background: #f9fafb;
  border-color: #3b82f6;
  transform: scale(0.98);
}

.credential-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
}

.credential-icon {
  width: 16px;
  height: 16px;
}

.credential-icon.staff {
  color: #3b82f6;
}

.credential-icon.admin {
  color: #f59e0b;
}

.credential-info {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: monospace;
}

.credential-info p {
  margin: 0.125rem 0;
}

/* Footer */
.login-footer {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  margin-top: auto;
  padding-top: 1rem;
}

.login-footer p {
  margin: 0.25rem 0;
}

/* Responsive */
@media (max-width: 375px) {
  .login-content {
    padding: 1.5rem 1rem;
  }

  .login-form-container {
    padding: 1.5rem;
  }

  .logo-text {
    font-size: 1.75rem;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
  }
}
</style>
