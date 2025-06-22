<template>
  <div
    class="rounded-2xl bg-[#13294b] p-6 shadow-md hover:scale-105 transition-transform duration-200 ease-out"
  >
    <div class="flex items-center gap-2 mb-2">
      <component :is="iconComponent" class="w-5 h-5 text-white" />
      <span class="text-sm text-white">{{ label }}</span>
    </div>
    <h2 class="text-2xl font-bold text-white">{{ value }}</h2>
    <p v-if="sub" class="text-sm text-gray-400">{{ sub }} {{ subValue }}</p>
  </div>
</template>

<script setup>
import { Ticket, ShoppingCart, Armchair, CalendarCheck } from "lucide-vue-next";

const props = defineProps({
  icon: String,
  label: String,
  value: [String, Number],
  sub: String,
  subValue: [String, Number],
});

const iconComponent = computed(() => {
  return (
    {
      Ticket,
      ShoppingCart,
      Armchair,
      CalendarCheck,
    }[props.icon] || Ticket
  );
});
</script>
