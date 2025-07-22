<!-- BaseModal.vue -->
<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Backdrop + Wrapper -->
      <div
        class="fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm transition-opacity flex justify-center items-start"
        @click.self="closeModal"
      >
        <!-- Modal Content -->
        <div
          class="relative bg-white rounded-lg shadow-xl transform transition-all w-full max-w-md mx-auto my-10"
          :class="sizeClasses"
          @click.stop
        >
          <!-- Header -->
          <div
            v-if="title || $slots.header"
            class="flex items-center justify-between p-6 border-b"
          >
            <h3 class="text-lg font-medium text-gray-900">
              <slot name="header">{{ title }}</slot>
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg p-1"
            >
              <i class="mdi mdi-close text-xl"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="flex items-center justify-end p-6 border-t bg-gray-50 rounded-b-lg"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  isOpen: boolean;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  persistent?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  persistent: false,
});

const emit = defineEmits<{
  close: [];
}>();

const sizeClasses = computed(() => {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };
  return sizes[props.size];
});

const closeModal = () => {
  if (!props.persistent) {
    emit("close");
  }
};
</script>
