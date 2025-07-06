<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200"
    :class="[
      active
        ? 'bg-white/10 text-white font-semibold'
        : 'text-white/70 hover:bg-white/10',
    ]"
  >
    <!-- ไอคอน -->
    <span class="text-xl w-6 text-center">
      <i :class="`mdi ${icon}`"></i>
    </span>

    <!-- ชื่อเมนู -->
    <span
      class="whitespace-nowrap text-sm transition-all duration-200 origin-left"
      :class="
        collapsed ? 'opacity-0 scale-x-0 w-0' : 'opacity-100 scale-x-100 w-auto'
      "
    >
      {{ label }}
    </span>
  </NuxtLink>
</template>

<script setup>
defineProps({
  icon: String,
  label: String,
  to: String,
  active: Boolean,
  collapsed: Boolean,
});
</script>
