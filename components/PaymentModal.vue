<template>
  <div
    class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
    v-if="visible"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-6 text-gray-800 relative"
    >
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <i class="mdi mdi-close text-xl"></i>
      </button>

      <h2 class="text-2xl font-bold text-center text-blue-600">
        {{ t("payment.title") }}
      </h2>

      <div class="text-sm">
        <p class="mb-1 font-semibold">
          {{ t("payment.zone") }}: <span class="text-blue-600">{{ zone }}</span>
        </p>
        <p class="mb-1 font-semibold">
          {{ t("payment.seats") }}:
          <span class="text-blue-600">{{ selectedSeats.join(", ") }}</span>
        </p>
        <p class="mb-1 font-semibold">
          {{ t("payment.total") }}:
          <span class="text-green-600 font-bold text-lg"
            >{{ total.toLocaleString() }} บาท</span
          >
        </p>
      </div>

      <div class="flex justify-end gap-4 pt-4">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          {{ t("cancel") }}
        </button>
        <button
          @click="$emit('confirmed')"
          class="px-6 py-2 rounded-md bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold hover:from-blue-600 hover:to-cyan-500"
        >
          {{ t("payment.confirm") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

defineProps({
  visible: Boolean,
  selectedSeats: Array,
  zone: String,
  total: Number,
});

const { t } = useI18n();
</script>
