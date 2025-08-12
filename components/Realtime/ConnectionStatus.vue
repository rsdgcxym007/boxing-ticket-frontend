<template>
  <div class="connection-status">
    <!-- Status Indicator -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div
          class="w-4 h-4 rounded-full transition-all duration-300"
          :class="[
            connectionStatus === 'connected'
              ? 'bg-green-500 shadow-lg shadow-green-500/50'
              : connectionStatus === 'connecting'
              ? 'bg-yellow-500 animate-pulse'
              : connectionStatus === 'disconnected'
              ? 'bg-red-500'
              : 'bg-gray-500',
          ]"
        ></div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
            {{ getStatusText() }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ getStatusDescription() }}
          </p>
        </div>
      </div>

      <button
        @click="toggleConnection"
        :disabled="connectionStatus === 'connecting'"
        class="px-4 py-2 rounded-lg font-medium transition-colors"
        :class="[
          connectionStatus === 'connected'
            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
            : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400',
          connectionStatus === 'connecting'
            ? 'opacity-50 cursor-not-allowed'
            : '',
        ]"
      >
        {{
          connectionStatus === "connected" ? "ยกเลิกการเชื่อมต่อ" : "เชื่อมต่อ"
        }}
      </button>
    </div>

    <!-- Connection Details -->
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        รายละเอียดการเชื่อมต่อ
      </h4>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            เซิร์ฟเวอร์
          </div>
          <div class="text-sm font-medium text-gray-800 dark:text-white">
            {{ serverUrl }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-500 dark:text-gray-400">โปรโตคอล</div>
          <div class="text-sm font-medium text-gray-800 dark:text-white">
            {{ protocol }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            เชื่อมต่อเมื่อ
          </div>
          <div class="text-sm font-medium text-gray-800 dark:text-white">
            {{ connectedAt ? formatTime(connectedAt) : "-" }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-500 dark:text-gray-400">ระยะเวลา</div>
          <div class="text-sm font-medium text-gray-800 dark:text-white">
            {{ connectionDuration }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Ping</div>
          <div class="text-sm font-medium text-gray-800 dark:text-white">
            {{ latency ? `${latency}ms` : "-" }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            การเชื่อมต่อใหม่
          </div>
          <div class="text-sm font-medium text-gray-800 dark:text-white">
            {{ reconnectAttempts }}/{{ maxReconnectAttempts }}
          </div>
        </div>
      </div>
    </div>

    <!-- Connection Quality -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          คุณภาพการเชื่อมต่อ
        </span>
        <span
          class="text-sm font-medium"
          :class="[
            connectionQuality === 'excellent'
              ? 'text-green-600'
              : connectionQuality === 'good'
              ? 'text-blue-600'
              : connectionQuality === 'fair'
              ? 'text-yellow-600'
              : 'text-red-600',
          ]"
        >
          {{ getQualityText() }}
        </span>
      </div>

      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          class="h-2 rounded-full transition-all duration-300"
          :class="[
            connectionQuality === 'excellent'
              ? 'bg-green-500'
              : connectionQuality === 'good'
              ? 'bg-blue-500'
              : connectionQuality === 'fair'
              ? 'bg-yellow-500'
              : 'bg-red-500',
          ]"
          :style="{ width: `${getQualityPercentage()}%` }"
        ></div>
      </div>
    </div>

    <!-- Activity Indicators -->
    <div class="grid grid-cols-3 gap-3 mb-4">
      <div
        class="bg-white dark:bg-gray-700 p-3 rounded-lg text-center border border-gray-200 dark:border-gray-600"
      >
        <div class="flex items-center justify-center mb-1">
          <Icon icon="mdi:arrow-up" class="text-green-500 text-lg" />
        </div>
        <div class="text-sm font-medium text-gray-800 dark:text-white">
          {{ messagesSent }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">ส่ง</div>
      </div>

      <div
        class="bg-white dark:bg-gray-700 p-3 rounded-lg text-center border border-gray-200 dark:border-gray-600"
      >
        <div class="flex items-center justify-center mb-1">
          <Icon icon="mdi:arrow-down" class="text-blue-500 text-lg" />
        </div>
        <div class="text-sm font-medium text-gray-800 dark:text-white">
          {{ messagesReceived }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">รับ</div>
      </div>

      <div
        class="bg-white dark:bg-gray-700 p-3 rounded-lg text-center border border-gray-200 dark:border-gray-600"
      >
        <div class="flex items-center justify-center mb-1">
          <Icon icon="mdi:alert-circle" class="text-red-500 text-lg" />
        </div>
        <div class="text-sm font-medium text-gray-800 dark:text-white">
          {{ errors }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">ข้อผิดพลาด</div>
      </div>
    </div>

    <!-- Recent Events -->
    <div v-if="recentEvents.length > 0" class="mb-4">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        เหตุการณ์ล่าสุด
      </h4>

      <div class="space-y-2 max-h-32 overflow-y-auto">
        <div
          v-for="event in recentEvents"
          :key="event.id"
          class="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs"
        >
          <Icon
            :icon="getEventIcon(event.type)"
            :class="[
              'text-sm mt-0.5',
              event.type === 'connected'
                ? 'text-green-500'
                : event.type === 'disconnected'
                ? 'text-red-500'
                : event.type === 'error'
                ? 'text-red-500'
                : event.type === 'message'
                ? 'text-blue-500'
                : 'text-gray-500',
            ]"
          />
          <div class="flex-1">
            <div class="text-gray-800 dark:text-white">{{ event.message }}</div>
            <div class="text-gray-500 dark:text-gray-400">
              {{ formatTime(event.timestamp) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Settings -->
    <div
      v-if="showAdvanced"
      class="border-t border-gray-200 dark:border-gray-700 pt-4"
    >
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        การตั้งค่าขั้นสูง
      </h4>

      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-600 dark:text-gray-400">
            การเชื่อมต่อใหม่อัตโนมัติ
          </label>
          <button
            @click="autoReconnect = !autoReconnect"
            :class="[
              'w-12 h-6 rounded-full transition-colors',
              autoReconnect ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600',
            ]"
          >
            <div
              class="w-5 h-5 bg-white rounded-full shadow transition-transform"
              :class="autoReconnect ? 'translate-x-6' : 'translate-x-0.5'"
            ></div>
          </button>
        </div>

        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-600 dark:text-gray-400">
            Heartbeat Interval
          </label>
          <select
            v-model="heartbeatInterval"
            class="text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded px-2 py-1"
          >
            <option value="5000">5s</option>
            <option value="10000">10s</option>
            <option value="30000">30s</option>
            <option value="60000">1m</option>
          </select>
        </div>

        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-600 dark:text-gray-400">
            Max Reconnect Attempts
          </label>
          <input
            v-model.number="maxReconnectAttempts"
            type="number"
            min="1"
            max="10"
            class="w-16 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded px-2 py-1 text-center"
          />
        </div>
      </div>
    </div>

    <!-- Toggle Advanced Settings -->
    <button
      @click="showAdvanced = !showAdvanced"
      class="w-full mt-4 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
    >
      <Icon
        :icon="showAdvanced ? 'mdi:chevron-up' : 'mdi:chevron-down'"
        class="inline mr-1"
      />
      {{ showAdvanced ? "ซ่อน" : "แสดง" }}การตั้งค่าขั้นสูง
    </button>

    <!-- Test Connection -->
    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex gap-2">
        <button
          @click="testConnection"
          :disabled="connectionStatus !== 'connected'"
          class="flex-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Icon icon="mdi:network" class="inline mr-1" />
          ทดสอบการเชื่อมต่อ
        </button>

        <button
          @click="clearLogs"
          class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Icon icon="mdi:delete" class="inline mr-1" />
          ล้างข้อมูล
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

// Props
const props = defineProps({
  websocketUrl: {
    type: String,
    default: "ws://localhost:4000/realtime",
  },
  autoConnect: {
    type: Boolean,
    default: true,
  },
});

// Emits
const emit = defineEmits(["connection-change", "message", "error"]);

// Reactive data
const connectionStatus = ref("disconnected"); // disconnected, connecting, connected, error
const connectedAt = ref(null);
const latency = ref(null);
const messagesSent = ref(0);
const messagesReceived = ref(0);
const errors = ref(0);
const reconnectAttempts = ref(0);
const maxReconnectAttempts = ref(5);
const autoReconnect = ref(true);
const heartbeatInterval = ref(10000);
const showAdvanced = ref(false);
const recentEvents = ref([]);
const websocket = ref(null);

// Computed
const serverUrl = computed(() => {
  try {
    const url = new URL(props.websocketUrl);
    return `${url.hostname}:${url.port}`;
  } catch {
    return props.websocketUrl;
  }
});

const protocol = computed(() => {
  return props.websocketUrl.startsWith("wss://") ? "WSS" : "WS";
});

const connectionDuration = computed(() => {
  if (!connectedAt.value) return "-";

  const duration = Date.now() - connectedAt.value.getTime();
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}ช ${minutes % 60}น`;
  } else if (minutes > 0) {
    return `${minutes}น ${seconds % 60}ว`;
  } else {
    return `${seconds}ว`;
  }
});

const connectionQuality = computed(() => {
  if (connectionStatus.value !== "connected") return "poor";
  if (!latency.value) return "good";

  if (latency.value < 100) return "excellent";
  if (latency.value < 300) return "good";
  if (latency.value < 1000) return "fair";
  return "poor";
});

// Methods
const getStatusText = () => {
  const statusMap = {
    connected: "เชื่อมต่อแล้ว",
    connecting: "กำลังเชื่อมต่อ...",
    disconnected: "ยกเลิกการเชื่อมต่อ",
    error: "เกิดข้อผิดพลาด",
  };
  return statusMap[connectionStatus.value] || "ไม่ทราบสถานะ";
};

const getStatusDescription = () => {
  const descMap = {
    connected: "การเชื่อมต่อเรียลไทม์ทำงานปกติ",
    connecting: "กำลังพยายามเชื่อมต่อกับเซิร์ฟเวอร์",
    disconnected: "ไม่ได้เชื่อมต่อกับเซิร์ฟเวอร์",
    error: "ไม่สามารถเชื่อมต่อได้",
  };
  return descMap[connectionStatus.value] || "";
};

const getQualityText = () => {
  const qualityMap = {
    excellent: "ยอดเยี่ยม",
    good: "ดี",
    fair: "พอใช้",
    poor: "ต่ำ",
  };
  return qualityMap[connectionQuality.value];
};

const getQualityPercentage = () => {
  const percentageMap = {
    excellent: 100,
    good: 75,
    fair: 50,
    poor: 25,
  };
  return percentageMap[connectionQuality.value];
};

const getEventIcon = (type) => {
  const iconMap = {
    connected: "mdi:link",
    disconnected: "mdi:link-off",
    error: "mdi:alert-circle",
    message: "mdi:message",
    heartbeat: "mdi:heart-pulse",
    reconnect: "mdi:refresh",
  };
  return iconMap[type] || "mdi:information";
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const addEvent = (type, message) => {
  const event = {
    id: Date.now(),
    type,
    message,
    timestamp: new Date(),
  };

  recentEvents.value.unshift(event);

  // Keep only last 10 events
  if (recentEvents.value.length > 10) {
    recentEvents.value = recentEvents.value.slice(0, 10);
  }
};

const connect = () => {
  if (
    connectionStatus.value === "connecting" ||
    connectionStatus.value === "connected"
  )
    return;

  connectionStatus.value = "connecting";
  addEvent("connecting", "กำลังเชื่อมต่อกับเซิร์ฟเวอร์...");

  try {
    websocket.value = new WebSocket(props.websocketUrl);

    websocket.value.onopen = () => {
      connectionStatus.value = "connected";
      connectedAt.value = new Date();
      reconnectAttempts.value = 0;

      addEvent("connected", "เชื่อมต่อสำเร็จ");
      emit("connection-change", "connected");

      startHeartbeat();
    };

    websocket.value.onmessage = (event) => {
      messagesReceived.value++;
      addEvent(
        "message",
        `ได้รับข้อความ: ${event.data.slice(0, 50)}${
          event.data.length > 50 ? "..." : ""
        }`
      );
      emit("message", event.data);
    };

    websocket.value.onclose = () => {
      connectionStatus.value = "disconnected";
      connectedAt.value = null;

      addEvent("disconnected", "การเชื่อมต่อขาดหายไป");
      emit("connection-change", "disconnected");

      stopHeartbeat();

      if (
        autoReconnect.value &&
        reconnectAttempts.value < maxReconnectAttempts.value
      ) {
        setTimeout(() => {
          reconnectAttempts.value++;
          addEvent(
            "reconnect",
            `พยายามเชื่อมต่อใหม่ครั้งที่ ${reconnectAttempts.value}`
          );
          connect();
        }, 2000 * reconnectAttempts.value);
      }
    };

    websocket.value.onerror = (error) => {
      connectionStatus.value = "error";
      errors.value++;

      addEvent("error", "เกิดข้อผิดพลาดในการเชื่อมต่อ");
      emit("error", error);
    };
  } catch (error) {
    connectionStatus.value = "error";
    errors.value++;
    addEvent("error", `ไม่สามารถสร้างการเชื่อมต่อได้: ${error.message}`);
  }
};

const disconnect = () => {
  if (websocket.value) {
    websocket.value.close();
    websocket.value = null;
  }

  connectionStatus.value = "disconnected";
  connectedAt.value = null;

  stopHeartbeat();
  addEvent("disconnected", "ยกเลิกการเชื่อมต่อด้วยตนเอง");
};

const toggleConnection = () => {
  if (connectionStatus.value === "connected") {
    disconnect();
  } else {
    connect();
  }
};

let heartbeatTimer = null;

const startHeartbeat = () => {
  stopHeartbeat();

  heartbeatTimer = setInterval(() => {
    if (websocket.value && websocket.value.readyState === WebSocket.OPEN) {
      const start = Date.now();

      // Send ping and measure latency
      websocket.value.send(JSON.stringify({ type: "ping", timestamp: start }));
      messagesSent.value++;

      // Simple latency simulation (in real implementation, server should respond with pong)
      setTimeout(() => {
        latency.value = Date.now() - start;
        addEvent("heartbeat", `Ping: ${latency.value}ms`);
      }, Math.random() * 100 + 50);
    }
  }, heartbeatInterval.value);
};

const stopHeartbeat = () => {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
};

const testConnection = () => {
  if (websocket.value && websocket.value.readyState === WebSocket.OPEN) {
    const testMessage = JSON.stringify({
      type: "test",
      message: "Connection test",
      timestamp: Date.now(),
    });

    websocket.value.send(testMessage);
    messagesSent.value++;
    addEvent("message", "ส่งข้อความทดสอบ");
  }
};

const clearLogs = () => {
  recentEvents.value = [];
  messagesSent.value = 0;
  messagesReceived.value = 0;
  errors.value = 0;
  reconnectAttempts.value = 0;
};

// Watch for settings changes
watch(heartbeatInterval, () => {
  if (connectionStatus.value === "connected") {
    startHeartbeat();
  }
});

// Lifecycle
onMounted(() => {
  if (props.autoConnect) {
    connect();
  }
});

onUnmounted(() => {
  disconnect();
});

// Expose methods for parent component
defineExpose({
  connect,
  disconnect,
  send: (message) => {
    if (websocket.value && websocket.value.readyState === WebSocket.OPEN) {
      websocket.value.send(message);
      messagesSent.value++;
      return true;
    }
    return false;
  },
});
</script>

<style scoped>
.connection-status {
  width: 100%;
  padding: 1rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.dark .connection-status {
  background: #1f2937;
}
</style>
