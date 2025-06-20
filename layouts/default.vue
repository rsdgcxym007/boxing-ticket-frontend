<template>
  <div class="flex flex-col min-h-screen bg-gray-900">
    <Navbar />
    <main class="flex-grow">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
</script>
