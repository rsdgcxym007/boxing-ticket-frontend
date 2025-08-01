<template>
  <div
    v-if="isElectron && platform !== 'darwin'"
    class="electron-window-controls flex items-center space-x-1"
  >
    <!-- Minimize Button -->
    <button
      @click="minimizeWindow"
      class="window-control-btn minimize-btn"
      title="Minimize"
    >
      <Icon name="mdi:window-minimize" class="w-4 h-4" />
    </button>

    <!-- Maximize/Restore Button -->
    <button
      @click="maximizeWindow"
      class="window-control-btn maximize-btn"
      :title="isMaximized ? 'Restore' : 'Maximize'"
    >
      <Icon
        :name="isMaximized ? 'mdi:window-restore' : 'mdi:window-maximize'"
        class="w-4 h-4"
      />
    </button>

    <!-- Close Button -->
    <button
      @click="closeWindow"
      class="window-control-btn close-btn"
      title="Close"
    >
      <Icon name="mdi:window-close" class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useElectron } from "../composables/useElectron";
const {
  isElectron,
  platform,
  isMaximized,
  minimizeWindow: electronMinimize,
  maximizeWindow: electronMaximize,
  closeWindow: electronClose,
  updateMaximizedState,
} = useElectron();

const minimizeWindow = async () => {
  await electronMinimize();
};

const maximizeWindow = async () => {
  await electronMaximize();
  await updateMaximizedState();
};

const closeWindow = async () => {
  await electronClose();
};

// Update maximized state on mount
onMounted(() => {
  if (isElectron.value) {
    updateMaximizedState();
  }
});
</script>

<style scoped>
.electron-window-controls {
  -webkit-app-region: no-drag;
  user-select: none;
}

.window-control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  transition: all 0.2s ease;
  -webkit-app-region: no-drag;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
}

.minimize-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.maximize-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.close-btn:hover {
  background: #ef4444;
  color: white;
}

.window-control-btn:active {
  transform: scale(0.95);
}

/* Platform specific styles */
.platform-win32 .electron-window-controls {
  height: 32px;
}

.platform-linux .electron-window-controls {
  height: 28px;
}

/* Dark mode adjustments */
.dark .window-control-btn {
  color: #d1d5db;
}

.dark .minimize-btn:hover,
.dark .maximize-btn:hover {
  background: #4b5563;
  color: white;
}
</style>
