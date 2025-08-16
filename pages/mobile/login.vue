<template>
  <div class="muay-thai-login">
    <!-- Background with Fighter Silhouettes -->
    <div class="combat-background">
      <div class="fighter-overlay"></div>
      <div class="ring-lights"></div>
    </div>

    <!-- Content -->
    <div class="login-content">
      <!-- Arena Header -->
      <div class="arena-header">
        <div class="arena-logo">
          <div class="boxing-ring-icon">
            <Icon icon="mdi:boxing-glove" class="glove-icon" />
          </div>
          <h1 class="arena-title combat-text">PATONG ARENA</h1>
          <div class="subtitle-thai">🥊 เวทีมวยไทย</div>
        </div>
        <p class="fight-subtitle">STAFF ACCESS PORTAL</p>
      </div>

      <!-- Login Form -->
      <div class="combat-form-container">
        <form @submit.prevent="handleLogin" class="combat-form">
          <!-- Username Field -->
          <div class="field-group">
            <label for="username" class="field-label combat-text">
              <Icon icon="mdi:account-circle" class="label-icon" />
              FIGHTER ID
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              class="combat-input"
              :class="{ error: errors.username }"
              placeholder="Enter your fighter ID"
              autocomplete="username"
              :disabled="isLoading"
            />
            <div v-if="errors.username" class="error-text">
              {{ errors.username }}
            </div>
          </div>

          <!-- Password Field -->
          <div class="field-group">
            <label for="password" class="field-label combat-text">
              <Icon icon="mdi:shield-lock" class="label-icon" />
              ACCESS CODE
            </label>
            <div class="password-wrapper">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="combat-input password-field"
                :class="{ error: errors.password }"
                placeholder="Enter access code"
                autocomplete="current-password"
                :disabled="isLoading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-reveal"
                :disabled="isLoading"
              >
                <Icon
                  :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
                  class="reveal-icon"
                />
              </button>
            </div>
            <div v-if="errors.password" class="error-text">
              {{ errors.password }}
            </div>
          </div>

          <!-- Remember Me -->
          <div class="field-group">
            <label class="remember-label">
              <input
                v-model="form.rememberMe"
                type="checkbox"
                class="remember-input"
                :disabled="isLoading"
              />
              <div class="remember-custom"></div>
              <span class="remember-text">Remember this fighter</span>
            </label>
          </div>

          <!-- Combat Login Button -->
          <button
            type="submit"
            class="combat-login-btn punch-effect"
            :disabled="isLoading || !isFormValid"
          >
            <div v-if="isLoading" class="btn-loading">
              <div class="combat-spinner"></div>
              <span class="combat-text">ENTERING ARENA...</span>
            </div>
            <div v-else class="btn-content">
              <Icon icon="mdi:fire" class="fire-icon" />
              <span class="combat-text">ENTER ARENA</span>
              <Icon icon="mdi:fire" class="fire-icon" />
            </div>
          </button>

          <!-- Success Alert -->
          <div v-if="loginSuccess" class="victory-alert">
            <Icon icon="mdi:trophy" class="trophy-icon" />
            <div class="victory-content">
              <h4 class="combat-text">VICTORY! �</h4>
              <p>Welcome to the arena, fighter!</p>
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="loginError" class="defeat-alert">
            <Icon icon="mdi:alert-octagon" class="alert-icon" />
            <div class="alert-content">
              <h4 class="combat-text">ACCESS DENIED</h4>
              <p>{{ loginError }}</p>
            </div>
          </div>
        </form>
      </div>

      <!-- Training Credentials - REMOVED -->
      
      <!-- Arena Footer -->
      <div class="arena-footer">
        <p>&copy; 2025 Patong Muay Thai Arena</p>
        <p class="combat-text">FIGHTER ACCESS SYSTEM v2.0</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
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
const loginSuccess = ref(false);

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
    loginSuccess.value = false;

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

    console.log("📱 Attempting login with username:", form.value.username);

    // Call authStore.login with username, password, and deviceInfo
    const user = await authStore.login(
      form.value.username,
      form.value.password,
      deviceInfo
    );

    console.log("✅ Login successful:", user);

    // Show success message
    loginSuccess.value = true;

    // Save credentials if remember me is checked
    if (form.value.rememberMe) {
      localStorage.setItem(
        "staff_credentials",
        JSON.stringify({
          username: form.value.username,
          rememberMe: true,
        })
      );
    }

    // Wait a bit to show success message then redirect
    setTimeout(async () => {
      await router.replace("/mobile"); // ใช้ replace เพื่อไม่ให้กลับมาหน้า login ได้
    }, 1500);
  } catch (error) {
    console.error("❌ Login failed:", error);
    loginError.value = error.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
    loginSuccess.value = false;
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
  console.log("📱 Mobile Login: Component mounted");
  
  // Initialize auth store to load existing auth state
  authStore.initialize();
  
  console.log("🔍 Current auth state:", {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    token: process.client ? localStorage.getItem("token") : null,
  });

  // Check if already authenticated
  if (authStore.isAuthenticated) {
    console.log("✅ User already authenticated, redirecting to mobile dashboard");
    router.push("/mobile");
    return;
  }

  console.log("🚪 User not authenticated, staying on login page");
  
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
  middleware: "mobile-guest-only",
});

useSeoMeta({
  title: "Staff Login - QR Scanner",
  description: "Staff login for QR code scanner system",
});
</script>

<style scoped>
@import url("/assets/css/muay-thai-theme.css");

/* Combat Background */
.muay-thai-login {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
  position: relative;
  overflow-x: hidden;
}

.combat-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      ellipse at center top,
      rgba(225, 6, 0, 0.15) 0%,
      transparent 70%
    ),
    linear-gradient(
      135deg,
      rgba(225, 6, 0, 0.08) 0%,
      rgba(30, 41, 59, 0.95) 50%,
      rgba(255, 215, 0, 0.08) 100%
    );
  z-index: 1;
}

.fighter-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><linearGradient id="fighter" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgba(225,6,0,0.1)"/><stop offset="100%" style="stop-color:transparent"/></linearGradient></defs><path d="M100,900 C300,800 400,600 500,500 C600,400 700,200 900,100" stroke="url(%23fighter)" stroke-width="2" fill="none" opacity="0.3"/></svg>')
    no-repeat center center;
  background-size: cover;
  opacity: 0.3;
}

.ring-lights {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      circle at 20% 30%,
      rgba(255, 215, 0, 0.1) 0%,
      transparent 40%
    ),
    radial-gradient(circle at 80% 70%, rgba(225, 6, 0, 0.1) 0%, transparent 40%);
  animation: flickerLights 4s ease-in-out infinite alternate;
}

@keyframes flickerLights {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

/* Content Layout */
.login-content {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 420px;
  margin: 0 auto;
}

/* Arena Header */
.arena-header {
  text-align: center;
  margin-bottom: 3rem;
}

.arena-logo {
  margin-bottom: 1.5rem;
}

.boxing-ring-icon {
  margin-bottom: 1rem;
}

.glove-icon {
  font-size: 4rem;
  color: var(--primary-red);
  filter: drop-shadow(0 0 20px rgba(225, 6, 0, 0.5));
  animation: combatGlow 2s ease-in-out infinite alternate;
}

.arena-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--primary-red);
  text-shadow: 0 0 10px rgba(225, 6, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 3px;
  margin-bottom: 0.5rem;
}

.subtitle-thai {
  font-size: 1.2rem;
  color: var(--primary-gold);
  font-weight: 600;
}

.fight-subtitle {
  font-size: 1rem;
  color: var(--text-light);
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

/* Combat Form */
.combat-form-container {
  background: rgba(30, 41, 59, 0.85);
  border: 2px solid rgba(225, 6, 0, 0.6);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(15px);
  box-shadow: 0 0 30px rgba(225, 6, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.combat-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Field Groups */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.label-icon {
  font-size: 1.2rem;
  color: #ef4444;
}

/* Combat Inputs */
/* Combat Inputs */
.combat-input {
  background: rgba(51, 65, 85, 0.9);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 8px;
  padding: 1rem;
  font-size: 1.1rem;
  color: #ffffff;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-shadow: none;
  font-family: inherit;
}

.combat-input:focus {
  outline: none;
  border-color: rgba(225, 6, 0, 0.8);
  background: rgba(71, 85, 105, 0.95);
  box-shadow: 0 0 20px rgba(225, 6, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  color: #ffffff;
}

.combat-input::placeholder {
  color: rgba(203, 213, 225, 0.7);
  font-weight: 400;
}

.combat-input.error {
  border-color: #ef4444;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* Password Field */
.password-wrapper {
  position: relative;
}

.password-field {
  padding-right: 3rem;
}

.password-reveal {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--primary-gold);
  cursor: pointer;
  transition: color 0.3s ease;
}

.password-reveal:hover {
  color: var(--primary-red);
}

.reveal-icon {
  font-size: 1.2rem;
}

/* Remember Me */
.remember-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  color: #e2e8f0;
}

.remember-input {
  display: none;
}

.remember-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #fbbf24;
  border-radius: 4px;
  background: rgba(51, 65, 85, 0.8);
  position: relative;
  transition: all 0.3s ease;
}

.remember-input:checked + .remember-custom {
  background: #ef4444;
  border-color: #ef4444;
}

.remember-input:checked + .remember-custom::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 12px;
}

.remember-text {
  color: var(--text-light);
  font-size: 0.9rem;
}

/* Combat Login Button */
.combat-login-btn {
  background: linear-gradient(135deg, var(--primary-red) 0%, #b91c1c 100%);
  border: 2px solid var(--primary-gold);
  border-radius: 12px;
  padding: 1.2rem 2rem;
  font-size: 1.1rem;
  font-weight: 900;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.combat-login-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.combat-login-btn:hover::before {
  left: 100%;
}

.combat-login-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(225, 6, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.3);
  border-color: var(--primary-red);
}

.combat-login-btn:active:not(:disabled) {
  transform: translateY(-1px);
  animation: punchEffect 0.3s ease;
}

.combat-login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.fire-icon {
  font-size: 1.2rem;
  color: var(--primary-gold);
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.combat-spinner {
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

/* Alerts */
.victory-alert {
  background: rgba(34, 197, 94, 0.1);
  border: 2px solid #22c55e;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: victoryPulse 0.5s ease-in-out;
}

@keyframes victoryPulse {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.victory-content h4 {
  color: #22c55e;
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.victory-content p {
  color: var(--text-light);
  margin: 0;
  font-size: 0.9rem;
}

.trophy-icon {
  font-size: 1.5rem;
  color: #fbbf24;
}

.defeat-alert {
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid #ef4444;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: shake 0.5s ease-in-out;
}

.alert-content h4 {
  color: #ef4444;
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.alert-content p {
  color: var(--text-light);
  margin: 0;
  font-size: 0.9rem;
}

.alert-icon {
  font-size: 1.5rem;
  color: #ef4444;
}

.error-text {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

/* Training Credentials */
.training-credentials {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(5px);
}

.training-credentials h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-gold);
  font-size: 1.1rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.training-icon {
  font-size: 1.3rem;
  color: var(--primary-red);
}

.fighter-cards {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

.fighter-card {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.fighter-card:hover {
  border-color: var(--primary-red);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(225, 6, 0, 0.2);
}

.fighter-card.champion {
  border-color: var(--primary-gold);
  background: rgba(255, 215, 0, 0.05);
}

.fighter-card.champion:hover {
  border-color: var(--primary-gold);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

.fighter-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-light);
}

.fighter-icon {
  font-size: 1.2rem;
}

.red-fighter {
  color: var(--primary-red);
}

.blue-fighter {
  color: #3b82f6;
}

.champion-fighter {
  color: var(--primary-gold);
}

.fighter-stats p {
  margin: 0.25rem 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Arena Footer */
.arena-footer {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
}

.arena-footer p {
  margin: 0.25rem 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Combat Text Effect */
.combat-text {
  text-shadow: 0 0 5px currentColor, 0 1px 2px rgba(0, 0, 0, 0.8);
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-content {
    padding: 1.5rem 1rem;
  }

  .arena-title {
    font-size: 2rem;
  }

  .combat-form-container {
    padding: 1.5rem;
  }

  .fighter-cards {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 481px) {
  .fighter-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .fighter-card.champion {
    grid-column: 1 / -1;
  }
}
</style>
