<template>
  <div class="min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">🔍 Debug Auth Status</h1>

      <!-- User Info -->
      <div class="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">👤 User Information</h2>
        <pre class="bg-gray-700 p-4 rounded text-sm overflow-auto">{{
          JSON.stringify(authState, null, 2)
        }}</pre>
      </div>

      <!-- Token Info -->
      <div class="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">🔑 Token Information</h2>
        <div class="space-y-2">
          <p><strong>Has Token:</strong> {{ !!token }}</p>
          <p>
            <strong>Token:</strong>
            {{ token ? token.substring(0, 50) + "..." : "None" }}
          </p>
          <p>
            <strong>Expires:</strong>
            {{
              tokenExpiry
                ? new Date(parseInt(tokenExpiry)).toISOString()
                : "None"
            }}
          </p>
          <p><strong>Is Expired:</strong> {{ isTokenExpired }}</p>
        </div>
      </div>

      <!-- Navigation Test -->
      <div class="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">🧪 Navigation Test</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            @click="testNav('/admin/dashboard')"
            class="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Admin Dashboard
          </button>
          <button
            @click="testNav('/admin/orders')"
            class="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Orders
          </button>
          <button
            @click="testNav('/admin/pricing')"
            class="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Pricing
          </button>
          <button
            @click="testNav('/admin/zones')"
            class="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Zones
          </button>
          <button
            @click="testNav('/mobile/scanner')"
            class="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            QR Scanner
          </button>
          <button
            @click="testNav('/mobile/login')"
            class="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Mobile Login
          </button>
        </div>
      </div>

      <!-- Quick Login -->
      <div class="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">⚡ Quick Login</h2>
        <div class="space-y-4">
          <button
            @click="quickLogin('admin')"
            class="px-6 py-3 bg-red-600 rounded hover:bg-red-700 mr-4"
          >
            Login as Admin
          </button>
          <button
            @click="quickLogin('staff')"
            class="px-6 py-3 bg-yellow-600 rounded hover:bg-yellow-700 mr-4"
          >
            Login as Staff
          </button>
          <button
            @click="logout"
            class="px-6 py-3 bg-gray-600 rounded hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Console Log -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">📝 Console Log</h2>
        <div class="bg-gray-700 p-4 rounded h-40 overflow-auto">
          <div v-for="(log, index) in logs" :key="index" class="text-sm mb-1">
            {{ log }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";

// Page meta
definePageMeta({
  layout: "default",
});

const authStore = useAuthStore();
const router = useRouter();

// Reactive data
const logs = ref([]);
const authState = computed(() => ({
  user: authStore.user,
  isAuthenticated: authStore.isAuthenticated,
}));

const token = ref(null);
const tokenExpiry = ref(null);
const isTokenExpired = ref(false);

// Methods
const addLog = (message) => {
  logs.value.unshift(`${new Date().toISOString()}: ${message}`);
  if (logs.value.length > 50) logs.value.pop();
};

const testNav = async (path) => {
  addLog(`Testing navigation to: ${path}`);
  try {
    await router.push(path);
    addLog(`✅ Successfully navigated to: ${path}`);
  } catch (error) {
    addLog(`❌ Navigation failed: ${error.message}`);
  }
};

const quickLogin = (role) => {
  addLog(`Quick login as: ${role}`);

  // Create mock user
  const mockUser = {
    id: role === "admin" ? "admin-001" : "staff-001",
    name: role === "admin" ? "Test Admin" : "Test Staff",
    role: role,
  };

  // Set user in store
  authStore.setUser(mockUser);

  // Set token
  const mockToken = `mock-token-${role}-${Date.now()}`;
  const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  if (process.client) {
    localStorage.setItem("token", mockToken);
    localStorage.setItem("tokenExpiration", expiry.toString());
  }

  updateTokenInfo();
  addLog(`✅ Logged in as ${role}: ${mockUser.name}`);
};

const logout = () => {
  addLog("Logging out...");
  authStore.logout();
  if (process.client) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
  }
  updateTokenInfo();
  addLog("✅ Logged out successfully");
};

const updateTokenInfo = () => {
  if (process.client) {
    token.value = localStorage.getItem("token");
    tokenExpiry.value = localStorage.getItem("tokenExpiration");
    isTokenExpired.value = tokenExpiry.value
      ? Date.now() > parseInt(tokenExpiry.value)
      : false;
  }
};

// Initialize
onMounted(() => {
  addLog("Debug page loaded");
  authStore.initialize();
  updateTokenInfo();
  addLog(`User loaded: ${authStore.user?.name || "None"}`);
  addLog(`Role: ${authStore.user?.role || "None"}`);
});

// SEO
useSeoMeta({
  title: "Debug Auth - Boxing Ticket System",
  robots: "noindex,nofollow",
});
</script>
