<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0f1f3c] via-[#1a2b4d] to-[#0f1f3c] text-white px-4 py-6"
  >
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1
            class="text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            ทดสอบระบบ
          </h1>
          <p class="text-gray-400 text-sm md:text-base">
            ทดสอบและตรวจสอบการทำงานของระบบ
          </p>
        </div>
      </div>
    </div>

    <!-- Test Categories -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Unit Tests -->
      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="p-3 bg-blue-600 rounded-lg">
            <Icon icon="mdi:test-tube" class="text-2xl text-white" />
          </div>
          <h2 class="text-xl font-semibold text-white">Unit Tests</h2>
        </div>

        <div class="space-y-4">
          <div
            class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
          >
            <div>
              <div class="font-medium text-white">Authentication Tests</div>
              <div class="text-sm text-gray-400">25 tests</div>
            </div>
            <button
              @click="runTest('auth')"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              รันทดสอบ
            </button>
          </div>

          <div
            class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
          >
            <div>
              <div class="font-medium text-white">Booking System Tests</div>
              <div class="text-sm text-gray-400">42 tests</div>
            </div>
            <button
              @click="runTest('booking')"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              รันทดสอบ
            </button>
          </div>

          <div
            class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
          >
            <div>
              <div class="font-medium text-white">Payment Tests</div>
              <div class="text-sm text-gray-400">18 tests</div>
            </div>
            <button
              @click="runTest('payment')"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              รันทดสอบ
            </button>
          </div>

          <div
            class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
          >
            <div>
              <div class="font-medium text-white">API Tests</div>
              <div class="text-sm text-gray-400">33 tests</div>
            </div>
            <button
              @click="runTest('api')"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              รันทดสอบ
            </button>
          </div>
        </div>

        <div class="mt-6">
          <button
            @click="runAllUnitTests"
            class="w-full px-4 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors font-medium"
          >
            รันทดสอบทั้งหมด
          </button>
        </div>
      </div>

      <!-- Integration Tests -->
      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="p-3 bg-green-600 rounded-lg">
            <Icon icon="mdi:network" class="text-2xl text-white" />
          </div>
          <h2 class="text-xl font-semibold text-white">Integration Tests</h2>
        </div>

        <div class="space-y-4">
          <div
            class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
          >
            <div>
              <div class="font-medium text-white">Database Integration</div>
              <div class="text-sm text-gray-400">12 tests</div>
            </div>
            <button
              @click="runTest('db-integration')"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              รันทดสอบ
            </button>
          </div>

          <div
            class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
          >
            <div>
              <div class="font-medium text-white">External API Integration</div>
              <div class="text-sm text-gray-400">8 tests</div>
            </div>
            <button
              @click="runTest('api-integration')"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              รันทดสอบ
            </button>
          </div>

          <div
            class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
          >
            <div>
              <div class="font-medium text-white">Payment Gateway</div>
              <div class="text-sm text-gray-400">15 tests</div>
            </div>
            <button
              @click="runTest('payment-gateway')"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              รันทดสอบ
            </button>
          </div>

          <div
            class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
          >
            <div>
              <div class="font-medium text-white">Email System</div>
              <div class="text-sm text-gray-400">6 tests</div>
            </div>
            <button
              @click="runTest('email')"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              รันทดสอบ
            </button>
          </div>
        </div>

        <div class="mt-6">
          <button
            @click="runAllIntegrationTests"
            class="w-full px-4 py-3 bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-colors font-medium"
          >
            รันทดสอบทั้งหมด
          </button>
        </div>
      </div>
    </div>

    <!-- Performance Tests -->
    <div
      class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-8"
    >
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-purple-600 rounded-lg">
          <Icon icon="mdi:speedometer" class="text-2xl text-white" />
        </div>
        <h2 class="text-xl font-semibold text-white">Performance Tests</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          @click="runPerformanceTest('load')"
          class="p-4 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-colors text-center"
        >
          <Icon icon="mdi:weight" class="text-2xl mb-2" />
          <div class="font-medium">Load Test</div>
          <div class="text-sm text-gray-400">1000 users</div>
        </button>

        <button
          @click="runPerformanceTest('stress')"
          class="p-4 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-colors text-center"
        >
          <Icon icon="mdi:flash" class="text-2xl mb-2" />
          <div class="font-medium">Stress Test</div>
          <div class="text-sm text-gray-400">5000 users</div>
        </button>

        <button
          @click="runPerformanceTest('endurance')"
          class="p-4 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-colors text-center"
        >
          <Icon icon="mdi:timer" class="text-2xl mb-2" />
          <div class="font-medium">Endurance Test</div>
          <div class="text-sm text-gray-400">24 hours</div>
        </button>

        <button
          @click="runPerformanceTest('spike')"
          class="p-4 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-colors text-center"
        >
          <Icon icon="mdi:trending-up" class="text-2xl mb-2" />
          <div class="font-medium">Spike Test</div>
          <div class="text-sm text-gray-400">Sudden load</div>
        </button>
      </div>
    </div>

    <!-- Security Tests -->
    <div
      class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-8"
    >
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-red-600 rounded-lg">
          <Icon icon="mdi:shield-bug" class="text-2xl text-white" />
        </div>
        <h2 class="text-xl font-semibold text-white">Security Tests</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          @click="runSecurityTest('sql-injection')"
          class="p-4 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors text-center"
        >
          <Icon icon="mdi:database-alert" class="text-2xl mb-2" />
          <div class="font-medium">SQL Injection</div>
        </button>

        <button
          @click="runSecurityTest('xss')"
          class="p-4 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors text-center"
        >
          <Icon icon="mdi:code-tags" class="text-2xl mb-2" />
          <div class="font-medium">XSS Testing</div>
        </button>

        <button
          @click="runSecurityTest('csrf')"
          class="p-4 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors text-center"
        >
          <Icon icon="mdi:shield-cross" class="text-2xl mb-2" />
          <div class="font-medium">CSRF Testing</div>
        </button>

        <button
          @click="runSecurityTest('auth')"
          class="p-4 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors text-center"
        >
          <Icon icon="mdi:account-lock" class="text-2xl mb-2" />
          <div class="font-medium">Auth Bypass</div>
        </button>

        <button
          @click="runSecurityTest('bruteforce')"
          class="p-4 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors text-center"
        >
          <Icon icon="mdi:key-variant" class="text-2xl mb-2" />
          <div class="font-medium">Brute Force</div>
        </button>

        <button
          @click="runSecurityTest('privilege')"
          class="p-4 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors text-center"
        >
          <Icon icon="mdi:account-arrow-up" class="text-2xl mb-2" />
          <div class="font-medium">Privilege Escalation</div>
        </button>
      </div>
    </div>

    <!-- Test Results -->
    <div
      v-if="testResults.length > 0"
      class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-8"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-white">ผลการทดสอบ</h2>
        <div class="flex gap-2">
          <button
            @click="exportResults"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icon icon="mdi:download" class="inline mr-2" />
            ส่งออกผล
          </button>
          <button
            @click="clearResults"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ล้างผล
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="result in testResults"
          :key="result.id"
          class="p-4 rounded-lg border"
          :class="[
            result.status === 'passed'
              ? 'bg-green-500/10 border-green-500/20'
              : result.status === 'failed'
              ? 'bg-red-500/10 border-red-500/20'
              : result.status === 'warning'
              ? 'bg-yellow-500/10 border-yellow-500/20'
              : 'bg-blue-500/10 border-blue-500/20',
          ]"
        >
          <div class="flex items-start gap-3">
            <Icon
              :icon="
                result.status === 'passed'
                  ? 'mdi:check-circle'
                  : result.status === 'failed'
                  ? 'mdi:close-circle'
                  : result.status === 'warning'
                  ? 'mdi:alert-circle'
                  : 'mdi:clock'
              "
              :class="[
                'text-lg mt-0.5',
                result.status === 'passed'
                  ? 'text-green-400'
                  : result.status === 'failed'
                  ? 'text-red-400'
                  : result.status === 'warning'
                  ? 'text-yellow-400'
                  : 'text-blue-400',
              ]"
            />
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <div class="font-medium text-white">{{ result.testName }}</div>
                <div class="text-sm text-gray-400">{{ result.duration }}ms</div>
              </div>
              <div class="text-sm text-gray-300 mt-1">{{ result.message }}</div>
              <div class="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span>{{ formatDateTime(result.timestamp) }}</span>
                <span v-if="result.totalTests"
                  >{{ result.passedTests }}/{{ result.totalTests }} ผ่าน</span
                >
                <span v-if="result.coverage"
                  >Coverage: {{ result.coverage }}%</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Progress Modal -->
    <div
      v-if="showTestModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold text-white mb-6">{{ currentTest }}</h3>

        <div class="space-y-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-300">ความคืบหน้า:</span>
            <span class="text-white">{{ testProgress }}%</span>
          </div>

          <div class="w-full bg-gray-700 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${testProgress}%` }"
            ></div>
          </div>

          <p class="text-gray-300 text-sm text-center">{{ testMessage }}</p>

          <div class="flex justify-center">
            <button
              @click="cancelTest"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

// Page meta
definePageMeta({
  middleware: ["auth", "admin-only"],
  layout: "admin",
});

// Reactive data
const showTestModal = ref(false);
const currentTest = ref("");
const testProgress = ref(0);
const testMessage = ref("");
const testResults = ref([]);

// Methods
const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const addTestResult = (testName, message, status = "passed", details = {}) => {
  testResults.value.unshift({
    id: Date.now(),
    testName,
    message,
    status,
    timestamp: new Date().toISOString(),
    duration: Math.floor(Math.random() * 5000) + 100,
    ...details,
  });
};

const runTestWithProgress = async (testName, steps, simulateResults) => {
  currentTest.value = testName;
  showTestModal.value = true;
  testProgress.value = 0;

  try {
    for (let i = 0; i < steps.length; i++) {
      testMessage.value = steps[i];
      testProgress.value = ((i + 1) / steps.length) * 100;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    showTestModal.value = false;

    // Simulate test results
    if (simulateResults) {
      simulateResults();
    }

    return true;
  } catch (error) {
    showTestModal.value = false;
    throw error;
  }
};

// Unit Tests
const runTest = async (testType) => {
  const testConfigs = {
    auth: {
      name: "Authentication Tests",
      steps: [
        "ตรวจสอบการล็อกอิน...",
        "ทดสอบ JWT Tokens...",
        "ทดสอบการออกจากระบบ...",
        "เสร็จสิ้น!",
      ],
      totalTests: 25,
      passedTests: 24,
    },
    booking: {
      name: "Booking System Tests",
      steps: [
        "ทดสอบการจองที่นั่ง...",
        "ทดสอบการยกเลิกการจอง...",
        "ทดสอบการคำนวณราคา...",
        "เสร็จสิ้น!",
      ],
      totalTests: 42,
      passedTests: 41,
    },
    payment: {
      name: "Payment Tests",
      steps: [
        "ทดสอบการชำระเงิน...",
        "ทดสอบ Refund...",
        "ทดสอบ Payment Gateway...",
        "เสร็จสิ้น!",
      ],
      totalTests: 18,
      passedTests: 18,
    },
    api: {
      name: "API Tests",
      steps: [
        "ทดสอบ REST API...",
        "ทดสอบ WebSocket...",
        "ทดสอบ Rate Limiting...",
        "เสร็จสิ้น!",
      ],
      totalTests: 33,
      passedTests: 32,
    },
  };

  const config = testConfigs[testType];
  if (!config) return;

  await runTestWithProgress(config.name, config.steps, () => {
    const hasFailed = config.passedTests < config.totalTests;
    addTestResult(
      config.name,
      hasFailed ? "มีบางการทดสอบที่ล้มเหลว" : "การทดสอบทั้งหมดผ่าน",
      hasFailed ? "warning" : "passed",
      {
        totalTests: config.totalTests,
        passedTests: config.passedTests,
        coverage: Math.floor(Math.random() * 20) + 80,
      }
    );
  });
};

const runAllUnitTests = async () => {
  await runTestWithProgress(
    "Unit Tests ทั้งหมด",
    [
      "เตรียมสภาพแวดล้อมการทดสอบ...",
      "รัน Authentication Tests...",
      "รัน Booking System Tests...",
      "รัน Payment Tests...",
      "รัน API Tests...",
      "รวมผลการทดสอบ...",
      "เสร็จสิ้น!",
    ],
    () => {
      addTestResult("Unit Tests ทั้งหมด", "ทดสอบทั้งหมดเสร็จสิ้น", "passed", {
        totalTests: 118,
        passedTests: 115,
        coverage: 87,
      });
    }
  );
};

const runAllIntegrationTests = async () => {
  await runTestWithProgress(
    "Integration Tests ทั้งหมด",
    [
      "ตั้งค่า Test Environment...",
      "ทดสอบ Database Integration...",
      "ทดสอบ External API Integration...",
      "ทดสอบ Payment Gateway...",
      "ทดสอบ Email System...",
      "รวมผลการทดสอบ...",
      "เสร็จสิ้น!",
    ],
    () => {
      addTestResult(
        "Integration Tests ทั้งหมด",
        "การทดสอบ Integration เสร็จสิ้น",
        "passed",
        {
          totalTests: 41,
          passedTests: 40,
          coverage: 92,
        }
      );
    }
  );
};

// Performance Tests
const runPerformanceTest = async (testType) => {
  const testConfigs = {
    load: {
      name: "Load Test (1000 users)",
      steps: [
        "เตรียม Virtual Users...",
        "สร้าง Load Pattern...",
        "เริ่มการทดสอบ...",
        "วิเคราะห์ผล...",
        "เสร็จสิ้น!",
      ],
    },
    stress: {
      name: "Stress Test (5000 users)",
      steps: [
        "เตรียม High Load...",
        "เพิ่ม Virtual Users...",
        "ทดสอบ Breaking Point...",
        "วิเคราะห์ผล...",
        "เสร็จสิ้น!",
      ],
    },
    endurance: {
      name: "Endurance Test (24 hours)",
      steps: [
        "เตรียม Long-running Test...",
        "เริ่มการทดสอบ...",
        "ตรวจสอบ Memory Leaks...",
        "วิเคราะห์ผล...",
        "เสร็จสิ้น!",
      ],
    },
    spike: {
      name: "Spike Test",
      steps: [
        "เตรียม Baseline Load...",
        "สร้าง Traffic Spike...",
        "ตรวจสอบ Recovery...",
        "วิเคราะห์ผล...",
        "เสร็จสิ้น!",
      ],
    },
  };

  const config = testConfigs[testType];
  if (!config) return;

  await runTestWithProgress(config.name, config.steps, () => {
    const responseTime = Math.floor(Math.random() * 500) + 100;
    const throughput = Math.floor(Math.random() * 1000) + 500;

    addTestResult(
      config.name,
      `Response Time: ${responseTime}ms, Throughput: ${throughput} req/s`,
      responseTime < 300 ? "passed" : "warning"
    );
  });
};

// Security Tests
const runSecurityTest = async (testType) => {
  const testConfigs = {
    "sql-injection": {
      name: "SQL Injection Test",
      steps: [
        "ค้นหา Input Fields...",
        "ทดสอบ SQL Injection Patterns...",
        "ตรวจสอบ Database Response...",
        "เสร็จสิ้น!",
      ],
    },
    xss: {
      name: "XSS Testing",
      steps: [
        "ทดสอบ Reflected XSS...",
        "ทดสอบ Stored XSS...",
        "ทดสอบ DOM XSS...",
        "เสร็จสิ้น!",
      ],
    },
    csrf: {
      name: "CSRF Testing",
      steps: [
        "ตรวจสอบ CSRF Tokens...",
        "ทดสอบ Cross-origin Requests...",
        "ตรวจสอบ Protection...",
        "เสร็จสิ้น!",
      ],
    },
    auth: {
      name: "Authentication Bypass Test",
      steps: [
        "ทดสอบ Session Management...",
        "ทดสอบ Token Validation...",
        "ทดสอบ Authorization...",
        "เสร็จสิ้น!",
      ],
    },
    bruteforce: {
      name: "Brute Force Test",
      steps: [
        "ทดสอบ Rate Limiting...",
        "ทดสอบ Account Lockout...",
        "ทดสอบ CAPTCHA...",
        "เสร็จสิ้น!",
      ],
    },
    privilege: {
      name: "Privilege Escalation Test",
      steps: [
        "ทดสอบ Role-based Access...",
        "ทดสอบ Permission Boundaries...",
        "ตรวจสอบ Elevation Attempts...",
        "เสร็จสิ้น!",
      ],
    },
  };

  const config = testConfigs[testType];
  if (!config) return;

  await runTestWithProgress(config.name, config.steps, () => {
    const isSecure = Math.random() > 0.1; // 90% chance of being secure

    addTestResult(
      config.name,
      isSecure ? "ไม่พบช่องโหว่ความปลอดภัย" : "พบช่องโหว่ที่ต้องแก้ไข",
      isSecure ? "passed" : "failed"
    );
  });
};

const cancelTest = () => {
  showTestModal.value = false;
  addTestResult(currentTest.value, "การทดสอบถูกยกเลิก", "warning");
};

const exportResults = () => {
  // Simulate export
  const exportData = {
    timestamp: new Date().toISOString(),
    results: testResults.value,
  };

  console.log("Exporting test results:", exportData);

  // In real app, this would download a file or send to server
  alert("ส่งออกผลการทดสอบเรียบร้อยแล้ว");
};

const clearResults = () => {
  testResults.value = [];
};

// SEO
useSeoMeta({
  title: "System Testing - Admin Panel",
  description: "Comprehensive system testing tools and results",
});
</script>
